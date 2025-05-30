import { pool } from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT * FROM orders
    WHERE status IN ('paid', 'pending')
    ORDER BY created_at DESC
  `);
  return Response.json(rows);
}
