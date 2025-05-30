import { pool } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req) {
  const data = await req.json();
  const signatureKey = headers().get("x-callback-signature");

  const isValid = data && data.order_id && data.status_code;

  if (!isValid) return new Response("Invalid", { status: 400 });

  const orderId = data.order_id;
  const transactionStatus = data.transaction_status;

  let status = "pending";
  if (transactionStatus === "settlement") status = "paid";
  else if (transactionStatus === "cancel") status = "cancelled";

  await pool.query(`UPDATE orders SET status = ? WHERE midtrans_order_id = ?`, [status, orderId]);

  return Response.json({ success: true });
}
