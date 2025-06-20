import { pool } from "@/lib/db";

export async function DELETE(_, { params }) {
  const { id } = await params;
  await pool.query("DELETE FROM products WHERE id = ?", [id]);
  return Response.json({ message: "Produk dihapus" });
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { image_url, description, price, category, gender, is_featured, is_active } = body;

  await pool.query(
    `UPDATE products
     SET image_url = ?, description = ?, price = ?, category = ?, gender = ?, is_featured = ?, is_active = ?
     WHERE id = ?`,
    [image_url, description, price, category, gender, is_featured ? 1 : 0, is_active ? 1 : 0, id]
  );

  return Response.json({ message: "Produk diperbarui" });
}