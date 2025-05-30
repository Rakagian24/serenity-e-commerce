import { pool } from "@/lib/db";

export async function GET(request, { params }) {
  const id = params.id;
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ? AND is_active = 1", [id]);

  if (!rows.length) {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json(rows[0]);
}
