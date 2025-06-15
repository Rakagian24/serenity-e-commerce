import { pool } from "@/lib/db";

export async function POST(req, { params }) {
  const { id } = await params;

  await pool.query(
    `UPDATE orders SET status = 'received', delivery_status = 'delivered' WHERE id = ?`,
    [id]
  );

  return Response.json({ success: true });
}
