'use client';
import AdminSidebar from "@/app/components/AdminSidebar";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [orders, setOrders] = useState([]);

  const fetchTransactions = async () => {
    const res = await fetch("/api/admin/orders/transactions");
    const data = await res.json();
    setOrders(data.filter(order => order.status === "paid" || order.status === "cancelled"));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi</h1>
        {orders.map((order) => (
          <div key={order.id} className="border p-4 mb-4 rounded space-y-1">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status Pembayaran:</strong> {order.status}</p>
            <p><strong>Total:</strong> Rp {parseInt(order.total_price).toLocaleString()}</p>
            <p><strong>Tanggal:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
