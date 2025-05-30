import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // Total Orders
    const [orderResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM orders"
    );
    const totalOrders = orderResult[0].total;

    // Successful Transactions (paid, shipped, delivered)
    const [transactionResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM orders WHERE status IN ('paid', 'shipped', 'delivered')"
    );
    const successfulTransactions = transactionResult[0].total;

    // Currently Being Delivered
    const [deliveryResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM orders WHERE delivery_status = 'shipped'"
    );
    const currentDeliveries = deliveryResult[0].total;

    // Return Requests
    const [returnResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM orders WHERE delivery_status = 'returned' OR complaint IS NOT NULL"
    );
    const returnRequests = returnResult[0].total;

    // Total Customers
    const [customerResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM users WHERE role = 'customer'"
    );
    const totalCustomers = customerResult[0].total;

    // Total Products
    const [productResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM products"
    );
    const totalProducts = productResult[0].total;

    // Active Products
    const [activeProductResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM products WHERE is_active = 1"
    );
    const activeProducts = activeProductResult[0].total;

    // Total Revenue (from successful transactions)
    const [revenueResult] = await pool.execute(
      "SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE status IN ('paid', 'shipped', 'delivered')"
    );
    const totalRevenue = revenueResult[0].total;

    return NextResponse.json({
      orders: totalOrders,
      transactions: successfulTransactions,
      deliveries: currentDeliveries,
      returns: returnRequests,
      customers: totalCustomers,
      products: totalProducts,
      activeProducts: activeProducts,
      revenue: parseInt(totalRevenue)
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}