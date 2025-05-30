import { pool } from "@/lib/db";

export async function DELETE(_, { params }) {
  const id = params.id;
  await pool.query("DELETE FROM users WHERE id = ? AND role = 'admin'", [id]);
  return Response.json({ success: true });
}
