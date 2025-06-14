import { pool } from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  return Response.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const { image_url, description, price, category, gender, is_featured, is_active } = body;

  await pool.query(
    `INSERT INTO products (image_url, description, price, category, gender, is_featured, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [image_url, description, price, category, gender, is_featured ? 1 : 0, is_active ? 1 : 0]
  );

  return Response.json({ message: "Produk ditambahkan" });
}