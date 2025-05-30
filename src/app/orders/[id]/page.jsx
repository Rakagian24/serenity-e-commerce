"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      setOrder(data.order);
      setItems(data.items);
    };

    const fetchTracking = async () => {
      const res = await fetch(`/api/orders/tracking/${id}`);
      const data = await res.json();
      setTracking(data);
    };

    fetchOrder();
    fetchTracking();
  }, []);

  if (!order) return <p className="p-4">Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Detail Pesanan #{order.id}</h1>

        <div className="space-y-2 mb-6">
          <p><strong>Tanggal:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Status Pengiriman:</strong> {order.delivery_status}</p>
          <p><strong>Total:</strong> Rp {parseInt(order.total_price).toLocaleString()}</p>
        </div>

        <h2 className="text-xl font-semibold mb-2">Item Produk</h2>
        <ul className="mb-6">
          {items.map((item, i) => (
            <li key={i} className="border-b py-2 flex justify-between">
              <span>{item.description} x {item.quantity}</span>
              <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>

        {order.resi && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Pengiriman</h2>
            <p><strong>Kurir:</strong> {order.courier.toUpperCase()}</p>
            <p><strong>Resi:</strong> {order.resi}</p>

            {tracking?.result?.summary ? (
              <div className="mt-4 border p-4 rounded">
                <p><strong>Status:</strong> {tracking.result.summary.status}</p>
                <p><strong>Dikirim oleh:</strong> {tracking.result.summary.courier_name}</p>
                <p><strong>No Resi:</strong> {tracking.result.summary.waybill_number}</p>
                <ul className="mt-2 text-sm text-gray-700">
                  {tracking.result.manifest.map((m, i) => (
                    <li key={i}>📦 {m.manifest_date} {m.manifest_time} - {m.manifest_description}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 mt-2">Status pengiriman belum tersedia.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
