"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function PublicCatalog() {
  const [products, setProducts] = useState([]);
  const [kategori, setKategori] = useState("Semua");
  const [gender, setGender] = useState("Semua");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (kategori !== "Semua") params.append("category", kategori);
    if (gender !== "Semua") params.append("gender", gender);
    if (sort) params.append("sort", sort);
    if (search) params.append("q", search);

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [kategori, gender, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = ["Semua", "Baju", "Jaket", "Celana", "Aksesoris"];
  const genders = ["Semua", "Pria", "Wanita", "Unisex"];

  const ProductCard = ({ product }) => (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-emerald-100 hover:border-emerald-200 hover:-translate-y-2 transform">
        <div className="relative overflow-hidden">
          <img 
            src={product.image_url} 
            alt={product.description}
            className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
          </div>
          {product.is_featured && (
            <div className="absolute top-3 left-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                <span>⭐</span>
                <span>Featured</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {product.gender}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.description}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Rp {parseInt(product.price).toLocaleString()}
            </p>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Katalog <span className="text-emerald-200">Produk</span>
              </h1>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                Temukan koleksi lengkap fashion terbaik kami
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-auto">
              <path fill="rgb(236, 253, 245)" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,58.7C672,64,768,96,864,96C960,96,1056,64,1152,53.3C1248,43,1344,53,1392,58.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Produk</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Masukkan nama produk..."
                    className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
              <div className="lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
                <select 
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">Pilih Urutan</option>
                  <option value="asc">Harga Termurah</option>
                  <option value="desc">Harga Termahal</option>
                </select>
              </div>
              <div className="lg:w-32 flex items-end">
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Cari
                </button>
              </div>
            </div>
          </form>

          {/* Filter Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Filter Kategori</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setKategori(cat)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      kategori === cat 
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" 
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Filter Gender</label>
              <div className="flex flex-wrap gap-2">
                {genders.map(gen => (
                  <button
                    key={gen}
                    onClick={() => setGender(gen)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      gender === gen 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                    }`}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {kategori === "Semua" && gender === "Semua" ? "Semua Produk" : 
               `${kategori !== "Semua" ? `Kategori ${kategori}` : ""} ${gender !== "Semua" ? `- ${gender}` : ""}`}
            </h2>
            <div className="text-sm text-gray-600">
              {products.length} produk ditemukan
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse border border-emerald-100">
                  <div className="h-48 bg-gradient-to-r from-emerald-100 to-teal-100" />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 bg-emerald-100 rounded-full w-1/4" />
                      <div className="h-4 bg-blue-100 rounded-full w-1/4" />
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-emerald-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Produk Tidak Ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah kata kunci pencarian atau filter kategori</p>
              <button 
                onClick={() => {
                  setSearch("");
                  setKategori("Semua");
                  setGender("Semua");
                  setSort("");
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}