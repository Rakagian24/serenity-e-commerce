
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // Get recent activities (orders, products, users)
    const activities = [];

    // Recent Orders
    const [recentOrders] = await pool.execute(`
      SELECT 
        o.id,
        o.status,
        o.created_at,
        u.name as user_name,
        o.total_price
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 3
    `);

    recentOrders.forEach(order => {
      const timeAgo = getTimeAgo(order.created_at);
      activities.push({
        id: `order_${order.id}`,
        type: 'order',
        message: `Pesanan baru dari ${order.user_name || 'Customer'} - Rp ${parseInt(order.total_price).toLocaleString()}`,
        time: timeAgo,
        icon: '🛒'
      });
    });

    // Recent Products
    const [recentProducts] = await pool.execute(`
      SELECT 
        id,
        description,
        created_at,
        is_active
      FROM products
      ORDER BY created_at DESC
      LIMIT 2
    `);

    recentProducts.forEach(product => {
      const timeAgo = getTimeAgo(product.created_at);
      const productName = product.description.length > 30 
        ? product.description.substring(0, 30) + '...' 
        : product.description;
      
      activities.push({
        id: `product_${product.id}`,
        type: 'product',
        message: `Produk "${productName}" ${product.is_active ? 'ditambahkan' : 'dinonaktifkan'}`,
        time: timeAgo,
        icon: product.is_active ? '➕' : '⏸️'
      });
    });

    // Recent Payments (successful orders)
    const [recentPayments] = await pool.execute(`
      SELECT 
        o.id,
        o.created_at,
        o.total_price,
        u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.status IN ('paid', 'shipped', 'received')
      ORDER BY o.created_at DESC
      LIMIT 2
    `);

    recentPayments.forEach(payment => {
      const timeAgo = getTimeAgo(payment.created_at);
      activities.push({
        id: `payment_${payment.id}`,
        type: 'payment',
        message: `Pembayaran berhasil - Order #${payment.id}`,
        time: timeAgo,
        icon: '💳'
      });
    });

    // Recent Deliveries
    const [recentDeliveries] = await pool.execute(`
      SELECT 
        o.id,
        o.created_at,
        o.shipping_address,
        o.courier
      FROM orders o
      WHERE o.delivery_status = 'shipped'
      ORDER BY o.created_at DESC
      LIMIT 2
    `);

    recentDeliveries.forEach(delivery => {
      const timeAgo = getTimeAgo(delivery.created_at);
      const address = delivery.shipping_address ? 
        delivery.shipping_address.split(',')[0] : 'Alamat tidak diketahui';
      
      activities.push({
        id: `delivery_${delivery.id}`,
        type: 'delivery',
        message: `Pesanan dikirim ke ${address}`,
        time: timeAgo,
        icon: '🚚'
      });
    });

    // Recent Returns/Complaints
    const [recentReturns] = await pool.execute(`
      SELECT 
        o.id,
        o.created_at,
        o.complaint,
        u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.delivery_status = 'returned' OR o.complaint IS NOT NULL
      ORDER BY o.created_at DESC
      LIMIT 1
    `);

    recentReturns.forEach(returnOrder => {
      const timeAgo = getTimeAgo(returnOrder.created_at);
      activities.push({
        id: `return_${returnOrder.id}`,
        type: 'return',
        message: `Permintaan retur dari ${returnOrder.user_name || 'Customer'}`,
        time: timeAgo,
        icon: '🔄'
      });
    });

    // Sort by time and limit to 10 most recent
    const sortedActivities = activities
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    return NextResponse.json(sortedActivities);

  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activities" },
      { status: 500 }
    );
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const activityDate = new Date(date);
  const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Baru saja';
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari lalu`;
  
  return activityDate.toLocaleDateString('id-ID');
}