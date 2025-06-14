import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // Get monthly sales data for the last 6 months
    const [salesResult] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COALESCE(SUM(total_price), 0) as total_sales
      FROM orders 
      WHERE status IN ('paid', 'shipped', 'delivered')
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month
    `);

    const salesData = salesResult.map(row => ({
      name: row.month,
      value: parseInt(row.total_sales)
    }));

    return NextResponse.json(salesData);

  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales data" },
      { status: 500 }
    );
  }
}