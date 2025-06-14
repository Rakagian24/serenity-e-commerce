// /app/profile/page.jsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
  });
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    setForm({ ...data, password: "" });
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
    setForm({ ...form, password: "" });
  };

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Profil Saya
            </h1>
            <p className="text-gray-600">Kelola informasi akun dan pengiriman Anda</p>
          </div>

          <div className="space-y-8">
            {/* Profile Form Section */}
            <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Profil Akun & Pengiriman
                </h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Akun</label>
                      <input
                        type="text"
                        placeholder="Masukkan nama akun"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-emerald-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="Masukkan email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-emerald-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password Baru (opsional)</label>
                    <input
                      type="password"
                      placeholder="Kosongkan jika tidak ingin mengubah password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full border border-emerald-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="border-t border-emerald-100 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      Informasi Pengiriman
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Pengiriman</label>
                        <input
                          type="text"
                          placeholder="Nama penerima paket"
                          value={form.shipping_name || ""}
                          onChange={(e) => setForm({ ...form, shipping_name: e.target.value })}
                          className="w-full border border-emerald-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">No. HP</label>
                        <input
                          type="text"
                          placeholder="Nomor handphone"
                          value={form.shipping_phone || ""}
                          onChange={(e) => setForm({ ...form, shipping_phone: e.target.value })}
                          className="w-full border border-emerald-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
                      <textarea
                        placeholder="Masukkan alamat lengkap termasuk kode pos"
                        value={form.shipping_address || ""}
                        onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                        className="w-full border border-emerald-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all h-24 resize-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </form>
                
                {message && (
                  <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="text-emerald-700 font-medium flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order History Section */}
            <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  Riwayat Pemesanan
                </h2>
              </div>
              
              <div className="p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">Belum ada pesanan</p>
                    <p className="text-gray-400 text-sm mt-2">Pesanan Anda akan muncul di sini setelah melakukan pembelian</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-emerald-50 border-b border-emerald-100">
                          <th className="text-left p-4 font-semibold text-emerald-800">No. Pesanan</th>
                          <th className="text-left p-4 font-semibold text-emerald-800">Tanggal</th>
                          <th className="text-left p-4 font-semibold text-emerald-800">Total</th>
                          <th className="text-left p-4 font-semibold text-emerald-800">Status</th>
                          <th className="text-left p-4 font-semibold text-emerald-800">Pengiriman</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={order.id} className={`border-b border-emerald-50 hover:bg-emerald-25 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-emerald-25/50'}`}>
                            <td className="p-4">
                              <div className="flex flex-col">
                              <span className="font-semibold text-gray-700">#{order.id}</span>
                              <Link
                                href={`/orders/${order.id}`}
                                className="text-sm text-emerald-600 hover:text-emerald-700 underline mt-1"
                              >
                                Lihat Detail
                              </Link>
                            </div>
                            </td>
                            <td className="p-4 text-gray-700">
                              {new Date(order.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-emerald-600">
                                Rp {parseInt(order.total_price).toLocaleString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-emerald-100 text-emerald-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.delivery_status === 'shipping' ? 'bg-blue-100 text-blue-800' :
                                order.delivery_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.delivery_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}