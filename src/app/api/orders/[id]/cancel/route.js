// app/api/orders/[id]/cancel/route.js
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    
    // Validasi ID
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { message: 'ID pesanan tidak valid' },
        { status: 400 }
      );
    }

    // Ambil connection dari pool
    connection = await pool.getConnection();

    // 1. Cek apakah order exists dan statusnya
    const [rows] = await connection.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    const order = rows[0];
    
    // 2. Cek apakah order bisa dibatalkan
    const cancelableStatuses = ['pending', 'paid', 'processing'];
    if (!cancelableStatuses.includes(order.status)) {
      return NextResponse.json(
        { 
          message: `Pesanan dengan status '${order.status}' tidak dapat dibatalkan. Hanya pesanan dengan status pending, paid, atau processing yang dapat dibatalkan.` 
        },
        { status: 400 }
      );
    }

    // 3. Update status order menjadi cancelled
    await connection.execute(
      'UPDATE orders SET status = ?, delivery_status = ? WHERE id = ?',
      ['cancelled', 'returned', orderId]
    );

    // 4. Optional: Handle refund logic jika status adalah 'paid'
    if (order.status === 'paid') {
      // Tambahkan logic untuk refund di sini
      // Misalnya integration dengan Midtrans untuk refund
      
      // Contoh log refund (sesuaikan dengan kebutuhan):
      // await connection.execute(
      //   'INSERT INTO refunds (order_id, amount, status, created_at) VALUES (?, ?, ?, NOW())',
      //   [orderId, order.total_price, 'pending']
      // );
    }

    // 5. Optional: Send notification email/SMS to user
    // implementasi notifikasi bisa ditambahkan di sini

    return NextResponse.json(
      { 
        message: 'Pesanan berhasil dibatalkan',
        order_id: orderId,
        previous_status: order.status,
        new_status: 'cancelled'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  } finally {
    // Pastikan connection dikembalikan ke pool
    if (connection) {
      connection.release();
    }
  }
}