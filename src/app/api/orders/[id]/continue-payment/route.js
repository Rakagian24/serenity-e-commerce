import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID diperlukan" },
        { status: 400 }
      );
    }

    // Ambil data order dari database
    const [orderRows] = await pool.query(
      `SELECT id, user_id, total_price, status, midtrans_order_id, midtrans_token, shipping_name, shipping_phone, shipping_address 
       FROM orders 
       WHERE id = ? AND status = 'pending'`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan atau sudah dibayar" },
        { status: 404 }
      );
    }

    const order = orderRows[0];

    // Jika sudah punya token, langsung kirim kembali redirect_url
    if (order.midtrans_token) {
      return NextResponse.json({
        success: true,
        redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${order.midtrans_token}`,
        token: order.midtrans_token,
        message: "Link pembayaran berhasil digunakan kembali"
      });
    }

    // Jika belum ada midtrans_order_id, buat yang baru
    let midtransOrderId = order.midtrans_order_id;
    if (!midtransOrderId) {
      midtransOrderId = `ORDER-${order.id}-${Date.now()}`;
      
      await pool.query(
        `UPDATE orders SET midtrans_order_id = ? WHERE id = ?`,
        [midtransOrderId, orderId]
      );
    }

    // Ambil detail item pesanan
    const [orderItems] = await pool.query(
      `SELECT oi.*, p.name as product_name, p.price 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

    if (!serverKey || !clientKey) {
      return NextResponse.json(
        { message: "Konfigurasi Midtrans tidak lengkap" },
        { status: 500 }
      );
    }

    const itemDetails = orderItems.map(item => ({
      id: item.product_id.toString(),
      price: item.price,
      quantity: item.quantity,
      name: item.product_name.substring(0, 50)
    }));

    const transactionData = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: order.total_price
      },
      item_details: itemDetails,
      customer_details: {
        first_name: order.shipping_name || "Customer",
        phone: order.shipping_phone || "",
        shipping_address: {
          first_name: order.shipping_name || "Customer",
          phone: order.shipping_phone || "",
          address: order.shipping_address || ""
        }
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`
      }
    };

    const auth = Buffer.from(serverKey + ':').toString('base64');
    
    const midtransUrl = isProduction 
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const response = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(transactionData)
    });

    const midtransResponse = await response.json();

    if (!response.ok) {
      console.error('Midtrans Error:', midtransResponse);
      return NextResponse.json(
        { message: "Gagal membuat pembayaran di Midtrans", error: midtransResponse },
        { status: 500 }
      );
    }

    // Simpan token ke database
    await pool.query(
      `UPDATE orders SET midtrans_token = ? WHERE id = ?`,
      [midtransResponse.token, orderId]
    );

    return NextResponse.json({
      success: true,
      redirect_url: midtransResponse.redirect_url,
      token: midtransResponse.token,
      message: "Link pembayaran berhasil dibuat"
    });

  } catch (error) {
    console.error('Error continue payment:', error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
