import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params;

  const [orders] = await pool.query(
    `SELECT resi, courier, status, delivery_status FROM orders WHERE id = ?`,
    [id]
  );

  if (!orders.length)
    return Response.json({ message: "Order not found" }, { status: 404 });

  return NextResponse.json(orders[0]);
}
