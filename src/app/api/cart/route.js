import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const [rows] = await pool.query(`
    SELECT carts.id, carts.quantity, products.description, products.price, products.image_url, products.category
    FROM carts
    JOIN products ON products.id = carts.product_id
    WHERE carts.user_id = ?
  `, [session.user.id]);
  return Response.json(rows);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { product_id, quantity } = await req.json();
  await pool.query(`
    INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)
  `, [session.user.id, product_id, quantity || 1]);
  return Response.json({ success: true });
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await pool.query(`DELETE FROM carts WHERE id = ? AND user_id = ?`, [id, session.user.id]);
  return Response.json({ success: true });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  const { id, quantity } = await req.json();

  // Validasi quantity
  if (!id || !quantity || quantity < 1) {
    return new Response(JSON.stringify({ error: "Invalid input" }), {
      status: 400,
    });
  }

  await pool.query(`
    UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?
  `, [quantity, id, session.user.id]);

  return Response.json({ success: true });
}

