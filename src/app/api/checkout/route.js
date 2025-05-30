import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import midtransClient from "midtrans-client";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

    const [cartItems] = await pool.query(`
    SELECT c.product_id, c.quantity, p.price, p.description
    FROM carts c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `, [session.user.id]);

  if (cartItems.length === 0) {
    return Response.json({ error: "Keranjang kosong" }, { status: 400 });
  }

  // Hitung total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Ambil data pengiriman user
  const [userRows] = await pool.query(`
    SELECT shipping_name, shipping_phone, shipping_address FROM users WHERE id = ?
  `, [session.user.id]);
  const shipping = userRows[0];

  if (!shipping.shipping_name || !shipping.shipping_phone || !shipping.shipping_address) {
    return Response.json({ error: "Lengkapi data pengiriman di profil terlebih dahulu." }, { status: 400 });
  }

  // Simpan pesanan
  const [orderResult] = await pool.query(`
    INSERT INTO orders (user_id, total_price, shipping_name, shipping_phone, shipping_address)
    VALUES (?, ?, ?, ?, ?)`,
    [
      session.user.id,
      total,
      shipping.shipping_name,
      shipping.shipping_phone,
      shipping.shipping_address
    ]
  );
  const orderId = orderResult.insertId;

  // Simpan detail item
  for (const item of cartItems) {
    await pool.query(`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)`,
      [orderId, item.product_id, item.quantity, item.price]
    );
  }

  // Kosongkan keranjang
  await pool.query(`DELETE FROM carts WHERE user_id = ?`, [session.user.id]);

  // Midtrans setup
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

  let transaction = await snap.createTransaction({
    transaction_details: {
      order_id: `ORDER-${orderId}-${Date.now()}`,
      gross_amount: total,
    },
    customer_details: {
      email: session.user.email,
      first_name: shipping.shipping_name,
      phone: shipping.shipping_phone,
      billing_address: {
        address: shipping.shipping_address,
      },
    },
  });

  await pool.query(`UPDATE orders SET midtrans_order_id = ? WHERE id = ?`, [transaction.order_id, orderId]);

  return Response.json({
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  });
}
