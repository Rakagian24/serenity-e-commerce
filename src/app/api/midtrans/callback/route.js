import { pool } from "@/lib/db";
import crypto from "crypto";

export async function POST(req) {
  // Log bahwa function dipanggil
  console.log("🔥🔥🔥 [MIDTRANS CALLBACK] FUNCTION DIPANGGIL! 🔥🔥🔥");
  console.log("🕐 Timestamp:", new Date().toISOString());
  
  try {
    console.log("🔥 [MIDTRANS CALLBACK] DITERIMA");
    console.log("🌐 Request headers:", Object.fromEntries(req.headers.entries()));
    console.log("🔗 Request URL:", req.url);
    console.log("📍 User-Agent:", req.headers.get('user-agent'));
    console.log("🔍 Method:", req.method);
    console.log("🌍 Origin:", req.headers.get('origin'));
    console.log("🔗 Referer:", req.headers.get('referer'));

    // Baca raw body
    const rawBody = await req.text();
    console.log("📦 Raw body length:", rawBody.length);
    console.log("📦 Raw body:", rawBody);

    if (!rawBody) {
      console.error("❌ Body kosong!");
      return new Response("Empty body", { status: 400 });
    }

    // Parse JSON
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      return new Response("Invalid JSON", { status: 400 });
    }

    console.log("✅ Parsed JSON body:", JSON.stringify(body, null, 2));

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key: signatureFromMidtrans,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_time,
      transaction_id,
    } = body;

    // Validasi field wajib
    if (!order_id || !status_code || !gross_amount || !signatureFromMidtrans) {
      console.error("❌ Field wajib tidak lengkap:", {
        order_id: !!order_id,
        status_code: !!status_code,
        gross_amount: !!gross_amount,
        signature: !!signatureFromMidtrans
      });
      return new Response("Missing required fields", { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("❌ MIDTRANS_SERVER_KEY tidak ditemukan!");
      return new Response("Server configuration error", { status: 500 });
    }

    const formattedGross = parseFloat(gross_amount).toFixed(1); // Midtrans biasanya pakai 1 decimal
    const expectedSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + formattedGross + serverKey)
      .digest("hex");


    console.log("🔐 Signature Check:", {
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      fraud_status,
      payment_type,
      expectedSignature,
      signatureFromMidtrans,
      match: signatureFromMidtrans === expectedSignature
    });

    if (signatureFromMidtrans !== expectedSignature) {
      console.error("❌ Signature tidak cocok!");
      console.error("Expected:", expectedSignature);
      console.error("Received:", signatureFromMidtrans);
      return new Response("Invalid signature", { status: 403 });
    }

    // Cek apakah order ada di database
    const [existingOrder] = await pool.query(
      `SELECT id, status, total_price FROM orders WHERE midtrans_order_id = ?`,
      [order_id]
    );

    if (existingOrder.length === 0) {
      console.error("❌ Order tidak ditemukan:", order_id);
      return new Response("Order not found", { status: 404 });
    }

    console.log("📋 Existing order:", existingOrder[0]);

    // Mapping status dengan lebih detail
    let newStatus = "pending";
    let newDeliveryStatus = "pending";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        newStatus = "paid";
        newDeliveryStatus = "processing";
      } else if (fraud_status === "challenge") {
        newStatus = "pending";
      } else {
        newStatus = "cancelled";
      }
    } else if (transaction_status === "settlement") {
      newStatus = "paid";
      newDeliveryStatus = "processing";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    } else if (["cancel", "deny", "expire", "failure"].includes(transaction_status)) {
      newStatus = "cancelled";
      newDeliveryStatus = "pending"; // atau null tergantung logika bisnis
    }

    console.log("🎯 Status baru:", newStatus);
    console.log("📦 Delivery status baru:", newDeliveryStatus);

    // Update database dengan kedua kolom
    const [result] = await pool.query(
      `UPDATE orders 
      SET status = ?, delivery_status = ?, updated_at = NOW()
      WHERE midtrans_order_id = ?`,
      [newStatus, newDeliveryStatus, order_id]
    );

    console.log("🔁 Hasil update DB:", {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
      newStatus
    });

    if (result.affectedRows === 0) {
      console.error("❌ Tidak ada row yang terupdate!");
      return new Response("Update failed", { status: 500 });
    }

    console.log(`✅ Pesanan ${order_id} berhasil diupdate ke: ${newStatus}`);

    // Log untuk monitoring
    await pool.query(
      `INSERT INTO payment_logs (order_id, transaction_status, fraud_status, payment_type, raw_response, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [order_id, transaction_status, fraud_status || '', payment_type || '', JSON.stringify(body)]
    ).catch(logError => {
      console.warn("⚠️ Failed to save payment log:", logError.message);
    });

    return Response.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("🚨 Terjadi kesalahan di Midtrans Callback:", err);
    console.error("🚨 Stack trace:", err.stack);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Handle GET untuk testing
export async function GET() {
  console.log("🔍 GET request ke Midtrans callback endpoint");
  return Response.json({ 
    message: "Midtrans callback endpoint is working",
    timestamp: new Date().toISOString() 
  });
}