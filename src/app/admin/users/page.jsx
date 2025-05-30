"use client";
import { useState, useEffect } from "react";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAdmins(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      setForm({
        name: "",
        email: "",
        password: "",
      });
      fetchAdmins();
    } catch (error) {
      console.error("Error creating admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus admin ini?")) {
      setLoading(true);
      try {
        await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="ml-72 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Kelola Admin
              </h1>
              <p className="text-gray-600">Tambah dan kelola pengguna admin sistem</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>➕</span>
                  <span>Tambah Admin</span>
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama lengkap" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300" 
                    required 
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input 
                    type="email" 
                    placeholder="admin@serenity.com" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300" 
                    required 
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <input 
                    type="password" 
                    placeholder="Masukkan password" 
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300" 
                    required 
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "⏳ Menyimpan..." : "➕ Tambah Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Admins List Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>👥</span>
                  <span>Daftar Admin ({admins.length})</span>
                </h3>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-emerald-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-emerald-200 rounded w-3/4"></div>
                            <div className="h-3 bg-emerald-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : admins.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">👤</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Admin</h3>
                    <p className="text-gray-500">Tambahkan admin pertama menggunakan form di sebelah kiri</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {admins.map((admin) => (
                      <div key={admin.id} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-emerald-100">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {admin.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 mb-1">
                              {admin.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              📧 {admin.email}
                            </p>
                            <div className="flex items-center space-x-3 text-xs">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                🟢 Admin Aktif
                              </span>
                              <span className="text-gray-500">
                                ID: {admin.id}
                              </span>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <button 
                              onClick={() => handleDelete(admin.id)} 
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center space-x-1"
                            >
                              <span>🗑️</span>
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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