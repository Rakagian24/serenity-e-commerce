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

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [userRows] = await pool.query(`
    SELECT shipping_name, shipping_phone, shipping_address 
    FROM users 
    WHERE id = ?
  `, [session.user.id]);

  const shipping = userRows[0];

  if (!shipping.shipping_name || !shipping.shipping_phone || !shipping.shipping_address) {
    return Response.json({ error: "Lengkapi data pengiriman di profil terlebih dahulu." }, { status: 400 });
  }

  // Simpan pesanan
  const [orderResult] = await pool.query(`
    INSERT INTO orders (user_id, total_price, shipping_name, shipping_phone, shipping_address)
    VALUES (?, ?, ?, ?, ?)
  `, [
    session.user.id,
    total,
    shipping.shipping_name,
    shipping.shipping_phone,
    shipping.shipping_address
  ]);

  const id = orderResult.insertId;
  console.log("📝 Order berhasil disimpan dengan ID:", id);

  // Simpan item
  for (const item of cartItems) {
    await pool.query(`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `, [id, item.product_id, item.quantity, item.price]);
  }

  // Kosongkan keranjang
  await pool.query(`DELETE FROM carts WHERE user_id = ?`, [session.user.id]);

  // Setup Midtrans
  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });

  const customOrderId = `ORDER-${id}-${Date.now()}`;

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: customOrderId,
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

  console.log("🧾 Transaksi Midtrans berhasil dibuat:", transaction);

  const [updateResult] = await pool.query(
    `UPDATE orders SET midtrans_order_id = ?, midtrans_token = ? WHERE id = ?`,
    [customOrderId, transaction.token, id]
  );
  console.log("📦 midtrans_order_id berhasil disimpan ke orders:", updateResult);

  return Response.json({
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const [userRows] = await pool.query(`
    SELECT shipping_name, shipping_phone, shipping_address 
    FROM users 
    WHERE id = ?
  `, [session.user.id]);

  return Response.json(userRows[0] || {});
}
