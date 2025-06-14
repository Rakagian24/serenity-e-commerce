'use client';
import AdminSidebar from "@/app/components/AdminSidebar";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processingOrders, setProcessingOrders] = useState(new Set());

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (id) => {
    setProcessingOrders(prev => new Set([...prev, id]));
    try {
      await fetch(`/api/admin/orders/${id}/confirm`, { method: "POST" });
      fetchOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
    } finally {
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleSubmit = async (e, orderId) => {
    e.preventDefault();
    const resi = e.target.resi.value;
    const courier = e.target.courier.value;

    setProcessingOrders(prev => new Set([...prev, orderId]));
    try {
      await fetch(`/api/admin/orders/${orderId}/send`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resi, courier }),
      });
      fetchOrders();
      e.target.reset();
    } catch (error) {
      console.error("Error sending order:", error);
    } finally {
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return '💳';
      case 'accepted': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      case 'pending': return '⌛';
      default: return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDeliveryStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'returned': return '↩️';
      default: return '📋';
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'returned': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCourierIcon = (courier) => {
    switch(courier?.toLowerCase()) {
      case 'jne': return '🟡';
      case 'pos': return '🔴';
      case 'tiki': return '🟢';
      default: return '📦';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true; // tampilkan semua
    if (filter === 'unpaid') return order.status === "pending";
    if (filter === 'new') return order.status === "paid" && order.delivery_status === "pending";
    if (filter === 'accepted') return order.status === "paid" && order.delivery_status === "processing";
    if (filter === 'shipped') return order.status === "paid" && order.delivery_status === "shipped";
    return true;
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
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Daftar Pesanan
                </h1>
                <p className="text-gray-600">Kelola pesanan yang masuk dari customer</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">💳</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pesanan Baru</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {orders.filter(o => o.status === 'paid' && o.delivery_status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">✅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diterima</p>
                    <p className="text-2xl font-bold text-green-600">
                      {orders.filter(o => o.status === 'paid' && o.delivery_status === 'processing').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🚚</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dikirim</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {orders.filter(o => o.status === 'paid' && o.delivery_status === 'shipped').length}
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
                    <p className="text-sm text-gray-600">Total Nilai</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      Rp {orders.filter(o => o.status === 'paid').reduce((sum, order) => sum + parseInt(order.total_price || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Semua Pesanan', icon: '📋' },
                { key: 'new', label: 'Pesanan Baru', icon: '💳' },
                { key: 'unpaid', label: 'Belum Dibayar', icon: '⌛' },
                { key: 'accepted', label: 'Diterima', icon: '✅' },
                { key: 'shipped', label: 'Dikirim', icon: '🚚' }
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
                <span>📦</span>
                <span>Daftar Pesanan ({filteredOrders.length})</span>
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
                    <span className="text-4xl">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Pesanan</h3>
                  <p className="text-gray-500">Pesanan baru akan muncul di sini setelah customer melakukan pembayaran</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-emerald-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-emerald-200">
                            <span className="text-lg">{getStatusIcon(order.status)}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">
                            Rp {parseInt(order.total_price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Status Pesanan</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Status Pengiriman</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getDeliveryStatusColor(order.delivery_status)}`}>
                            {getDeliveryStatusIcon(order.delivery_status)} {order.delivery_status}
                          </span>
                        </div>
                      </div>

                      {order.customer_name && (
                        <div className="mb-4 pb-4 border-b border-emerald-200">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-medium">👤 Customer:</span>
                            <span>{order.customer_name}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-4">
                        {order.delivery_status === 'pending' && (
                          <button
                            onClick={() => acceptOrder(order.id)}
                            disabled={processingOrders.has(order.id)}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            {processingOrders.has(order.id) ? (
                              <>
                                <span className="animate-spin">⟳</span>
                                <span>Memproses...</span>
                              </>
                            ) : (
                              <>
                                <span>✅</span>
                                <span>Tandai Pesanan Diterima</span>
                              </>
                            )}
                          </button>
                        )}

                        {order.delivery_status === 'pending' && (
                          <form onSubmit={(e) => handleSubmit(e, order.id)} className="bg-white rounded-lg p-4 border border-emerald-200">
                            <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                              <span>🚚</span>
                              <span>Kirim Pesanan</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Resi</label>
                                <input 
                                  name="resi" 
                                  placeholder="Masukkan nomor resi" 
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                  required 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kurir</label>
                                <select 
                                  name="courier" 
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                  <option value="jne">🟡 JNE</option>
                                  <option value="pos">🔴 POS Indonesia</option>
                                  <option value="tiki">🟢 TIKI</option>
                                </select>
                              </div>
                              <div className="flex items-end">
                                <button 
                                  type="submit" 
                                  disabled={processingOrders.has(order.id)}
                                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                  {processingOrders.has(order.id) ? (
                                    <>
                                      <span className="animate-spin">⟳</span>
                                      <span>Mengirim...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>🚚</span>
                                      <span>Kirim</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </form>
                        )}

                        {order.delivery_status === 'shipped' && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 text-purple-700">
                              <span>🚚</span>
                              <span className="font-medium">Pesanan telah dikirim</span>
                            </div>
                            <p className="text-sm text-purple-600 mt-1">
                              Pesanan sedang dalam perjalanan ke customer
                            </p>
                          </div>
                        )}
                      </div>
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