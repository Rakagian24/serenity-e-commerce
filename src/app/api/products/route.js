import { pool } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const gender = searchParams.get("gender");
  const sort = searchParams.get("sort"); 
  const featured = searchParams.get("featured");

  let query = "SELECT * FROM products WHERE is_active = 1";
  const params = [];

  if (keyword) {
    query += " AND description LIKE ?";
    params.push(`%${keyword}%`);
  }

  if (category && category !== "Semua") {
    query += " AND category = ?";
    params.push(category);
  }

  if (gender && gender !== "Semua") {
    query += " AND gender = ?";
    params.push(gender);
  }

  if (featured === "1") {
    query += " AND is_featured = 1";
  }

  if (sort === "asc") query += " ORDER BY price ASC";
  else if (sort === "desc") query += " ORDER BY price DESC";

  const [rows] = await pool.query(query, params);
  return Response.json(rows);
}