'use client';
import AdminSidebar from "@/app/components/AdminSidebar";
import { useEffect, useState } from "react";

export default function DeliveriesPage() {
  const [orders, setOrders] = useState([]);

  const fetchDeliveries = async () => {
    const res = await fetch("/api/admin/orders/deliveries");
    const data = await res.json();
    setOrders(data.filter(order => order.status === "shipped"));
  };

  const handleTracking = async (orderId) => {
    const res = await fetch(`/api/orders/tracking/${orderId}`);
    const data = await res.json();

    if (data.result?.summary) {
      alert(`Status: ${data.result.summary.status}\nKurir: ${data.result.summary.courier_name}\nResi: ${data.result.summary.waybill_number}`);
    } else {
      alert("Tracking belum tersedia.");
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Pengiriman Berjalan</h1>
        {orders.map((order) => (
          <div key={order.id} className="border p-4 mb-4 rounded space-y-2">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Kurir:</strong> {order.courier}</p>
            <p><strong>Resi:</strong> {order.resi}</p>
            <button
              onClick={() => handleTracking(order.id)}
              className="bg-gray-800 text-white px-3 py-1 rounded"
            >
              Lihat Tracking
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
