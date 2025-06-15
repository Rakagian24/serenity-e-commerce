'use client';
import AdminSidebar from "@/app/components/AdminSidebar";
import { useEffect, useState } from "react";

export default function DeliveriesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState({});
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [processingOrders, setProcessingOrders] = useState(new Set());

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders/deliveries");
      const data = await res.json();
      setOrders(data.filter(order => order.status === "shipped"));
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (id) => { 
    setProcessingOrders(prev => new Set([...prev, id])); 
    try { 
      await fetch(`/api/orders/${id}/confirm`, { method: "POST" }); 
      fetchDeliveries(); // Refresh the deliveries list
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

  const handleTracking = async (id) => {
    try {
      const res = await fetch(`/api/orders/tracking/${id}`);
      const data = await res.json();

      if (data.resi && data.courier) {
        setSelectedTracking({
          id,
          status: data.delivery_status, // gunakan delivery_status langsung
          courier: data.courier,
          resi: data.resi,
        });
        setShowTrackingModal(true);
      } else {
        alert("Tracking belum tersedia.");
      }
    } catch (error) {
      console.error("Error fetching tracking:", error);
      alert("Gagal mengambil data tracking.");
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'shipped': return '🚚';
      case 'in_transit': return '📦';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_transit': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDeliveryStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '📋';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'returned': return '↩️';
      default: return '📦';
    }
  };

  const getCourierIcon = (courier) => {
    if (courier?.toLowerCase().includes('jne')) return '🟡';
    if (courier?.toLowerCase().includes('pos')) return '🔴';
    if (courier?.toLowerCase().includes('tiki')) return '🟢';
    if (courier?.toLowerCase().includes('sicepat')) return '🟠';
    if (courier?.toLowerCase().includes('jnt')) return '🔵';
    return '📦';
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-72 w-full min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Pengiriman Berjalan
                </h1>
                <p className="text-gray-600">Pantau status pengiriman pesanan yang sedang dalam perjalanan</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🚚</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sedang Dikirim</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {orders.filter(o => o.status === 'shipped').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Pengiriman</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {orders.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🏪</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kurir Aktif</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {new Set(orders.map(o => o.courier)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deliveries List */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>📦</span>
                <span>Daftar Pengiriman ({orders.length})</span>
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
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🚚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Pengiriman</h3>
                  <p className="text-gray-500">Pengiriman akan muncul di sini setelah pesanan dikirim</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {orders.map((order) => (
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
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Kurir</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getCourierIcon(order.courier)}</span>
                            <span className="text-sm font-medium text-gray-800">{order.courier || 'Belum ditentukan'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Nomor Resi</p>
                          <div className="bg-gray-100 px-3 py-1 rounded-lg">
                            <code className="text-sm font-mono text-gray-800">{order.resi || 'Belum tersedia'}</code>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Total Harga</p>
                          <p className="text-sm font-bold text-emerald-600">
                            Rp {parseInt(order.total_price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-emerald-200">
                        {order.customer_name && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-medium">👤 Customer:</span>
                            <span>{order.customer_name}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleTracking(order.id)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                          >
                            <span>🔍</span>
                            <span>Lihat Tracking</span>
                          </button>

                          {order.delivery_status === 'shipped' && ( 
                            <button 
                              onClick={() => acceptOrder(order.id)} 
                              disabled={processingOrders.has(order.id)} 
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2" 
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tracking Modal */}
        {showTrackingModal && selectedTracking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Detail Tracking</h3>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">📦</span>
                    <span className="font-bold">Order #{selectedTracking.id}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">
                        {getDeliveryStatusIcon(selectedTracking.status)} {selectedTracking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kurir:</span>
                      <span className="font-medium">{selectedTracking.courier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resi:</span>
                      <code className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedTracking.resi}</code>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}