// /api/profile/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const [rows] = await pool.query(
    `SELECT name, email, shipping_name, shipping_phone, shipping_address FROM users WHERE id = ?`,
    [session.user.id]
  );

  return Response.json(rows[0]);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const {
    name,
    email,
    password,
    shipping_name,
    shipping_phone,
    shipping_address,
  } = await req.json();

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      `UPDATE users SET name = ?, email = ?, password = ?, shipping_name = ?, shipping_phone = ?, shipping_address = ? WHERE id = ?`,
      [name, email, hashed, shipping_name, shipping_phone, shipping_address, session.user.id]
    );
  } else {
    await pool.query(
      `UPDATE users SET name = ?, email = ?, shipping_name = ?, shipping_phone = ?, shipping_address = ? WHERE id = ?`,
      [name, email, shipping_name, shipping_phone, shipping_address, session.user.id]
    );
  }

  return Response.json({ success: true });
}
