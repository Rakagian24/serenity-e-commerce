import { pool } from "@/lib/db";

export async function POST(req, { params }) {
  const { orderId } = await params;
  const { resi, courier } = await req.json();

  await pool.query(`
    UPDATE orders SET resi = ?, courier = ?, status = 'shipped', delivery_status = 'shipped' WHERE id = ?
  `, [resi, courier, orderId]);

  return Response.json({ success: true });
}
