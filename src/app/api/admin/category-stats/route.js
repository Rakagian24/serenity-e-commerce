// /app/api/admin/category-stats/route.js
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // Get product count by category
    const [categoryResult] = await pool.execute(`
      SELECT 
        category,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM products WHERE is_active = 1)), 1) as percentage
      FROM products 
      WHERE is_active = 1
      GROUP BY category
      ORDER BY count DESC
    `);

    const categoryColors = {
      'Baju': '#10b981',
      'Celana': '#14b8a6', 
      'Jaket': '#06b6d4',
      'Aksesoris': '#8b5cf6'
    };

    const categoryData = categoryResult.map(row => ({
      name: row.category,
      value: parseFloat(row.percentage),
      count: row.count,
      color: categoryColors[row.category] || '#6b7280'
    }));

    return NextResponse.json(categoryData);

  } catch (error) {
    console.error("Error fetching category stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch category stats" },
      { status: 500 }
    );
  }
}