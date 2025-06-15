import { pool } from "@/lib/db";
import crypto from "crypto";

export async function POST(req) {
  console.log("🔥🔥🔥 [MIDTRANS CALLBACK] MASUK!");
  console.log("🕐 Waktu:", new Date().toISOString());

  try {
    // Baca raw body
    const rawBody = await req.text();
    console.log("📦 Raw body:", rawBody);

    if (!rawBody) {
      console.error("❌ Body kosong!");
      return new Response("Empty body", { status: 400 });
    }

    // Parse JSON
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error("❌ Gagal parse JSON:", e.message);
      return new Response("Invalid JSON", { status: 400 });
    }

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_time,
      transaction_id
    } = body;

    // Validasi isian wajib
    if (!order_id || !status_code || !gross_amount || !signature_key) {
      console.error("❌ Field wajib kosong:", { order_id, status_code, gross_amount, signature_key });
      return new Response("Missing required fields", { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("❌ MIDTRANS_SERVER_KEY tidak tersedia!");
      return new Response("Missing server key", { status: 500 });
    }

    // ⚠️ Signature harus berdasarkan gross_amount asli (string), tanpa parsing ulang
    const expectedSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.error("❌ Signature tidak cocok!");
      console.log("Expected:", expectedSignature);
      console.log("Received:", signature_key);
      return new Response("Invalid signature", { status: 403 }); // ⛔️ Stop
    }

    // Cari order berdasarkan midtrans_order_id
    const [orderRows] = await pool.query(
      `SELECT id FROM orders WHERE midtrans_order_id = ?`,
      [order_id]
    );

    if (orderRows.length === 0) {
      console.error("❌ Order tidak ditemukan:", order_id);
      const [allOrders] = await pool.query(`SELECT midtrans_order_id FROM orders`);
      console.log("📋 Semua order ID yang ada:", allOrders.map(o => o.midtrans_order_id));
      return new Response("Order not found", { status: 404 });
    }

    const order = orderRows[0];

    // Tentukan status baru berdasarkan status Midtrans
    let newStatus = "pending";
    let deliveryStatus = "pending";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        newStatus = "paid";
        deliveryStatus = "processing";
      } else if (fraud_status === "challenge") {
        newStatus = "pending";
      } else {
        newStatus = "cancelled";
      }
    } else if (transaction_status === "settlement") {
      newStatus = "paid";
      deliveryStatus = "processing";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    } else if (["cancel", "deny", "expire", "failure"].includes(transaction_status)) {
      newStatus = "cancelled";
    }

    console.log("📦 Update order:", order_id);
    console.log("➡️ Status:", newStatus, "➡️ Delivery:", deliveryStatus);

    // Update status di database
    const [updateResult] = await pool.query(
      `UPDATE orders SET status = ?, delivery_status = ? WHERE midtrans_order_id = ?`,
      [newStatus, deliveryStatus, order_id]
    );

    console.log("✅ Order berhasil diupdate:", {
      affectedRows: updateResult.affectedRows,
      changedRows: updateResult.changedRows
    });

    // Simpan log transaksi
    await pool.query(
      `INSERT INTO payment_logs (order_id, transaction_status, fraud_status, payment_type, raw_response, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [order_id, transaction_status, fraud_status || "", payment_type || "", JSON.stringify(body)]
    ).catch((err) => {
      console.warn("⚠️ Gagal menyimpan log transaksi:", err.message);
    });

    return Response.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("🚨 Error di callback:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Endpoint GET (cek manual)
export async function GET() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  return Response.json({
    message: "Midtrans callback endpoint is working",
    time: new Date().toISOString(),
    serverKey: serverKey ? "[✅ Terdeteksi]" : "[❌ Tidak Terdeteksi]", // Untuk keamanan, hanya status
    rawServerKey: serverKey || null, // ⚠️ Jangan aktifkan di production
  });
}

