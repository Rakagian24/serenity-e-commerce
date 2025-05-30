import { pool } from "@/lib/db";

export async function POST(req, { params }) {
  const orderId = params.orderId;
  const { complaint } = await req.json();

  await pool.query(
    `UPDATE orders SET delivery_status = 'returned', complaint = ? WHERE id = ?`,
    [complaint, orderId]
  );

  return Response.json({ success: true });
}
