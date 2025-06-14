// /src/app/api/orders/history/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const [rows] = await pool.query(
    `SELECT id, created_at, total_price, status, delivery_status 
     FROM orders 
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [session.user.id]
  );

  return Response.json(rows);
}
