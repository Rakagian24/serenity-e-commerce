import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET(_, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { orderId } = await params;

  // Ambil info order
  const [[order]] = await pool.query(
    `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
    [orderId, session.user.id]
  );

  if (!order) {
    return new Response("Order not found", { status: 404 });
  }

  // Ambil item-itemnya
  const [items] = await pool.query(
    `SELECT oi.*, p.description, p.image_url FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  return Response.json({ order, items });
}
