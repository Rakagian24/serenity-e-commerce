import { pool } from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT DISTINCT u.id, u.name, u.email
    FROM messages m
    JOIN users u ON u.id = m.sender_id
    WHERE u.role = 'customer'
  `);

  return Response.json(rows);
}
