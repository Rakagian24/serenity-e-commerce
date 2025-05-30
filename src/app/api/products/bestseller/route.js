import { pool } from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT p.*, SUM(oi.quantity) AS total_sold
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    GROUP BY oi.product_id
    ORDER BY total_sold DESC
    LIMIT 6
  `);
  return Response.json(rows);
}
