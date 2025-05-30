import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const [rows] = await pool.query("SELECT name, email FROM users WHERE id = ?", [session.user.id]);
  return Response.json(rows[0]);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { name, email, password } = await req.json();

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [name, email, hashed, session.user.id]);
  } else {
    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, session.user.id]);
  }

  return Response.json({ success: true });
}
