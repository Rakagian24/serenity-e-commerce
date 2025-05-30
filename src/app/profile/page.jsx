"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
  });
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    setForm(data);
  };

  const fetchOrders = async () => {
    const res = await fetch("/api/orders/history");
    const data = await res.json();
    setOrders(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) setMessage("Profil berhasil diperbarui");
  };

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">Profil Akun & Pengiriman</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Akun"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Nama Pengiriman"
              value={form.shipping_name || ""}
              onChange={(e) => setForm({ ...form, shipping_name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="No. HP"
              value={form.shipping_phone || ""}
              onChange={(e) => setForm({ ...form, shipping_phone: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              placeholder="Alamat Lengkap"
              value={form.shipping_address || ""}
              onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Simpan
            </button>
          </form>
          {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Riwayat Pemesanan</h2>
          {orders.length === 0 ? (
            <p>Belum ada pesanan.</p>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">No. Pesanan</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Pengiriman</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="p-2">
                      <Link href={`/orders/${order.id}`} className="text-blue-600 underline">
                        #{order.id}
                      </Link>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>Rp {parseInt(order.total_price).toLocaleString()}</td>
                    <td>{order.status}</td>
                    <td>{order.delivery_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
