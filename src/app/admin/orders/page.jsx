'use client';
import AdminSidebar from "@/app/components/AdminSidebar";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
  };

  const acceptOrder = async (id) => {
    await fetch(`/api/admin/orders/${id}/accept`, { method: "POST" });
    fetchOrders();
  };

  const handleSubmit = async (e, orderId) => {
    e.preventDefault();
    const resi = e.target.resi.value;
    const courier = e.target.courier.value;

    await fetch(`/api/admin/orders/${orderId}/send`, {
      method: "POST",
      body: JSON.stringify({ resi, courier }),
    });

    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Order List</h1>
        {orders.filter(o => o.status === "paid").map((order) => (
          <div key={order.id} className="border p-4 mb-4 rounded space-y-2">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Status Pengiriman:</strong> {order.delivery_status}</p>

            <button
              onClick={() => acceptOrder(order.id)}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Tandai Pesanan Diterima
            </button>

            <form onSubmit={(e) => handleSubmit(e, order.id)} className="mt-2 space-x-2">
              <input name="resi" placeholder="Nomor Resi" className="border px-2 py-1" required />
              <select name="courier" className="border px-2 py-1">
                <option value="jne">JNE</option>
                <option value="pos">POS</option>
                <option value="tiki">TIKI</option>
              </select>
              <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Kirim Pesanan</button>
            </form>
          </div>
        ))}
      </main>
    </div>
  );
}
