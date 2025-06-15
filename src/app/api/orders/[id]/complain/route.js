import { pool } from "@/lib/db";

export async function POST(req, { params }) {
  const { id } = await params;
  const { complaint } = await req.json();

  await pool.query(
    `UPDATE orders SET status = 'returned', delivery_status = 'returned', complaint = ? WHERE id = ?`,
    [complaint, id]
  );

  return Response.json({ success: true });
}
