'use client';
import AdminSidebar from "@/app/components/AdminSidebar";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders/history");
      const data = await res.json();
      setOrders(data.filter(order => order.delivery_status === "delivered" || order.delivery_status === "returned"));
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return '✅';
      case 'returned': return '↩️';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'returned': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.delivery_status === filter;
  });

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-72 w-full min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Riwayat Pemesanan
                </h1>
                <p className="text-gray-600">Kelola dan pantau riwayat pesanan yang telah selesai</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">✅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Berhasil Dikirim</p>
                    <p className="text-2xl font-bold text-green-600">
                      {orders.filter(o => o.delivery_status === 'delivered').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">↩️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dikembalikan</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {orders.filter(o => o.delivery_status === 'returned').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">💰</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Pendapatan</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      Rp {orders.reduce((sum, order) => sum + parseInt(order.total_price || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Semua', icon: '📋' },
                { key: 'delivered', label: 'Berhasil Dikirim', icon: '✅' },
                { key: 'returned', label: 'Dikembalikan', icon: '↩️' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    filter === filterOption.key
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  <span className="mr-2">{filterOption.icon}</span>
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>📋</span>
                <span>Daftar Riwayat ({filteredOrders.length})</span>
              </h2>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="h-4 bg-emerald-200 rounded w-1/4"></div>
                          <div className="h-3 bg-emerald-200 rounded w-1/3"></div>
                          <div className="h-3 bg-emerald-200 rounded w-1/5"></div>
                        </div>
                        <div className="h-8 bg-emerald-200 rounded-full w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📈</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Riwayat</h3>
                  <p className="text-gray-500">Riwayat pemesanan akan muncul di sini setelah ada pesanan yang selesai</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-emerald-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-emerald-200">
                            <span className="text-lg">{getStatusIcon(order.delivery_status)}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">
                            Rp {parseInt(order.total_price).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Status Pesanan</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Status Pengiriman</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.delivery_status)}`}>
                            {getStatusIcon(order.delivery_status)} {order.delivery_status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Waktu Selesai</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.updated_at || order.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>

                      {order.customer_name && (
                        <div className="mt-4 pt-4 border-t border-emerald-200">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-medium">👤 Customer:</span>
                            <span>{order.customer_name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}