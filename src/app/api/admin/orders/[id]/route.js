import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;

  const [[order]] = await pool.query(
    `SELECT * FROM orders WHERE id = ?`,
    [id]
  );

  if (!order) return new Response("Not Found", { status: 404 });

  if (session.user.role !== "admin" && order.user_id !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const [items] = await pool.query(
    `SELECT oi.quantity, oi.price, p.description
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [id]
  );

  return Response.json({ order, items });
}
