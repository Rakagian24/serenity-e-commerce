import { pool } from "@/lib/db";

export async function POST(req, { params }) {
  const { orderId } = await params;

  await pool.query(
    `UPDATE orders SET delivery_status = 'received' WHERE id = ?`,
    [orderId]
  );

  return Response.json({ success: true });
}
