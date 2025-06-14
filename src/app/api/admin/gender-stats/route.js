import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // Get product count by gender
    const [genderResult] = await pool.execute(`
      SELECT 
        gender,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM products WHERE is_active = 1)), 1) as percentage
      FROM products 
      WHERE is_active = 1
      GROUP BY gender
      ORDER BY count DESC
    `);

    const genderColors = {
      'Pria': '#3b82f6',
      'Wanita': '#ec4899',
      'Unisex': '#10b981'
    };

    const genderData = genderResult.map(row => ({
      name: row.gender,
      value: parseFloat(row.percentage),
      count: row.count,
      color: genderColors[row.gender] || '#6b7280'
    }));

    return NextResponse.json(genderData);

  } catch (error) {
    console.error("Error fetching gender stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch gender stats" },
      { status: 500 }
    );
  }
}