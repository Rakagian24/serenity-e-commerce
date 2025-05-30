import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const [rows] = await pool.query(
    `SELECT id, name, email FROM users WHERE role = 'admin' ORDER BY created_at DESC`
  );
  return Response.json(rows);
}

export async function POST(req) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) return new Response("Invalid", { status: 400 });

  const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (exists.length > 0) return new Response("Email already exists", { status: 409 });

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (name, email, password, role, email_verified) VALUES (?, ?, ?, 'admin', 1)`,
    [name, email, hashed]
  );

  return Response.json({ success: true });
}
