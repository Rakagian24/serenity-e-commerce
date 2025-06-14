"use client";
import AdminSidebar from "@/app/components/AdminSidebar";
import { useState, useEffect } from "react";

export default function ProductAdminPage() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    image_url: "",
    description: "",
    price: "",
    category: "Baju",
    gender: "Unisex",
    is_featured: false,
    is_active: true,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        await fetch(`/api/admin/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      
      setForm({
        image_url: "",
        description: "",
        price: "",
        category: "Baju",
        gender: "Unisex",
        is_featured: false,
        is_active: true,
      });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      image_url: product.image_url,
      description: product.description,
      price: product.price,
      category: product.category,
      gender: product.gender,
      is_featured: !!product.is_featured,
      is_active: !!product.is_active,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setLoading(true);
      try {
        await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      image_url: "",
      description: "",
      price: "",
      category: "Baju",
      gender: "Unisex",
      is_featured: false,
      is_active: true,
    });
  };

  return (
    <div className="ml-72 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <AdminSidebar />
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Kelola Produk
              </h1>
              <p className="text-gray-600">Tambah, edit, dan kelola produk Serenity</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>{editingId ? "✏️" : "➕"}</span>
                  <span>{editingId ? "Edit Produk" : "Tambah Produk"}</span>
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image URL */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">URL Foto</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/image.jpg" 
                    value={form.image_url} 
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300" 
                    required 
                  />
                  {form.image_url && (
                    <div className="mt-2">
                      <img 
                        src={form.image_url} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-emerald-200"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Deskripsi Produk</label>
                  <textarea 
                    placeholder="Masukkan deskripsi produk..." 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 h-24 resize-none" 
                    required 
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Harga</label>
                  <input 
                    type="number" 
                    placeholder="50000" 
                    value={form.price} 
                    onChange={(e) => setForm({ ...form, price: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300" 
                    required 
                  />
                </div>

                {/* Category and Gender Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Kategori</label>
                    <select 
                      value={form.category} 
                      onChange={(e) => setForm({ ...form, category: e.target.value })} 
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    >
                      {["Baju", "Jaket", "Celana", "Aksesoris"].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Gender</label>
                    <select 
                      value={form.gender} 
                      onChange={(e) => setForm({ ...form, gender: e.target.value })} 
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    >
                      {["Pria", "Wanita", "Unisex"].map((gender) => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={form.is_featured} 
                        onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} 
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
                        form.is_featured 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-500' 
                          : 'border-gray-300 group-hover:border-emerald-400'
                      }`}>
                        {form.is_featured && (
                          <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                      ⭐ Produk Pilihan
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={form.is_active} 
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })} 
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
                        form.is_active 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-500' 
                          : 'border-gray-300 group-hover:border-emerald-400'
                      }`}>
                        {form.is_active && (
                          <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                      🟢 Status Aktif
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "⏳ Menyimpan..." : editingId ? "💾 Simpan Perubahan" : "➕ Tambah Produk"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                    >
                      ❌ Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Products List Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>📋</span>
                  <span>Daftar Produk ({products.length})</span>
                </h3>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-emerald-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-emerald-200 rounded w-3/4"></div>
                            <div className="h-3 bg-emerald-200 rounded w-1/2"></div>
                            <div className="h-3 bg-emerald-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📦</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Produk</h3>
                    <p className="text-gray-500">Tambahkan produk pertama Anda menggunakan form di sebelah kiri</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {products.map((product) => (
                      <div key={product.id} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-emerald-100">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-emerald-200 flex-shrink-0">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.description}
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                🖼️
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">
                              {product.description}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                                {product.category}
                              </span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                {product.gender}
                              </span>
                              <span className="font-semibold text-emerald-600">
                                Rp {parseInt(product.price).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs">
                              {product.is_featured && (
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                                  ⭐ Featured
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded-full font-medium ${
                                product.is_active 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {product.is_active ? '🟢 Aktif' : '🔴 Nonaktif'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 flex-shrink-0">
                            <button 
                              onClick={() => handleEdit(product)} 
                              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-1"
                            >
                              <span>✏️</span>
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)} 
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