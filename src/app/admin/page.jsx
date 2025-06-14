// /app/admin/page.jsx - Updated Dashboard Component
"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    transactions: 0,
    deliveries: 0,
    returns: 0,
    customers: 0,
    products: 0,
    revenue: 0,
    activeProducts: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all dashboard data in parallel
        const [statsRes, salesRes, categoryRes, genderRes, activitiesRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/sales-data"),
          fetch("/api/admin/category-stats"),
          fetch("/api/admin/gender-stats"),
          fetch("/api/admin/recent-activities")
        ]);

        const [statsData, salesData, categoryData, genderData, activitiesData] = await Promise.all([
          statsRes.json(),
          salesRes.json(),
          categoryRes.json(),
          genderRes.json(),
          activitiesRes.json()
        ]);

        setStats(statsData);
        setSalesData(salesData);
        setCategoryData(categoryData);
        setGenderData(genderData);
        setRecentActivities(activitiesData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        
        // Fallback to mock data if API fails
        setStats({
          orders: 0,
          transactions: 0,
          deliveries: 0,
          returns: 0,
          customers: 0,
          products: 0,
          revenue: 0,
          activeProducts: 0,
        });
        setSalesData([]);
        setCategoryData([]);
        setGenderData([]);
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <AdminSidebar />
      <main className="ml-72 min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Dashboard Admin
                </h1>
                <p className="text-gray-600">Overview statistik dan performa toko Serenity</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Pesanan"
              value={stats.orders}
              icon="📦"
              color="from-blue-500 to-blue-600"
              loading={loading}
            />
            <StatsCard
              title="Transaksi Berhasil"
              value={stats.transactions}
              icon="✅"
              color="from-green-500 to-emerald-600"
              loading={loading}
            />
            <StatsCard
              title="Total Pelanggan"
              value={stats.customers}
              icon="👥"
              color="from-purple-500 to-purple-600"
              loading={loading}
            />
            <StatsCard
              title="Total Produk"
              value={stats.products}
              icon="🛍️"
              color="from-orange-500 to-orange-600"
              loading={loading}
            />
          </div>

          {/* Revenue and Delivery Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <RevenueCard revenue={stats.revenue} loading={loading} />
            <DeliveryCard deliveries={stats.deliveries} returns={stats.returns} loading={loading} />
            <ProductStatusCard 
              total={stats.products} 
              active={stats.activeProducts} 
              loading={loading} 
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Sales Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>📈</span>
                  <span>Penjualan Bulanan</span>
                </h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="h-64 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl animate-pulse"></div>
                ) : salesData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📈</span>
                      <p>Belum ada data penjualan</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value) => [`Rp ${parseInt(value).toLocaleString()}`, 'Penjualan']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #d1fae5', 
                          borderRadius: '8px' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="url(#colorGradient)" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#059669' }}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>🥧</span>
                  <span>Distribusi Kategori</span>
                </h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="h-64 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl animate-pulse"></div>
                ) : categoryData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">🥧</span>
                      <p>Belum ada data kategori</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gender Distribution Chart */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>👤</span>
                  <span>Distribusi Gender Produk</span>
                </h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl animate-pulse"></div>
                ) : genderData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">👤</span>
                      <p>Belum ada data gender</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={genderData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Persentase']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #ddd6fe', 
                          borderRadius: '8px' 
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>🕐</span>
                  <span>Aktivitas Terbaru</span>
                </h3>
              </div>
              <div className="p-6">
                <RecentActivities activities={recentActivities} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatsCard({ title, value, icon, color, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden transform hover:scale-105 transition-all duration-300">
      <div className={`bg-gradient-to-r ${color} p-4`}>
        <div className="flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm opacity-90">{title}</p>
            {loading ? (
              <div className="h-8 w-16 bg-white bg-opacity-20 rounded animate-pulse mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            )}
          </div>
          <div className="text-3xl opacity-80">{icon}</div>
        </div>
      </div>
    </div>
  );
}

function RevenueCard({ revenue, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">💰</span>
          <div className="text-white">
            <p className="text-sm opacity-90">Total Pendapatan</p>
            {loading ? (
              <div className="h-8 w-32 bg-white bg-opacity-20 rounded animate-pulse mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">Rp {revenue.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <p className="text-sm text-green-700">📊 Dari transaksi berhasil</p>
      </div>
    </div>
  );
}

function DeliveryCard({ deliveries, returns, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🚚</span>
          <div className="text-white">
            <p className="text-sm opacity-90">Status Pengiriman</p>
            {loading ? (
              <div className="h-6 w-24 bg-white bg-opacity-20 rounded animate-pulse mt-1"></div>
            ) : (
              <p className="text-lg font-bold">{deliveries} Sedang Dikirim</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
        {loading ? (
          <div className="h-4 w-20 bg-blue-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-sm text-blue-700">🔄 {returns} Permintaan Retur</p>
        )}
      </div>
    </div>
  );
}

function ProductStatusCard({ total, active, loading }) {
  const inactive = total - active;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">📊</span>
          <div className="text-white">
            <p className="text-sm opacity-90">Status Produk</p>
            {loading ? (
              <div className="h-6 w-24 bg-white bg-opacity-20 rounded animate-pulse mt-1"></div>
            ) : (
              <p className="text-lg font-bold">{active} Aktif</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
        {loading ? (
          <div className="h-4 w-20 bg-purple-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-sm text-purple-700">⏸️ {inactive} Nonaktif</p>
        )}
      </div>
    </div>
  );
}

function RecentActivities({ activities, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl animate-pulse">
            <div className="w-10 h-10 bg-emerald-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-emerald-200 rounded w-3/4"></div>
              <div className="h-3 bg-emerald-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🕐</span>
        </div>
        <p className="text-gray-500">Belum ada aktivitas terbaru</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition-all duration-300">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-emerald-200">
            <span className="text-lg">{activity.icon}</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{activity.message}</p>
            <p className="text-sm text-gray-600">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}