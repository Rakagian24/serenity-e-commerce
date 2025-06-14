"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestseller, setBestseller] = useState([]);
  const [byCategory, setByCategory] = useState({});
  const [byGender, setByGender] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchFeatured(),
      fetchBestseller(),
      fetchByCategory(),
      fetchByGender()
    ]);
    setLoading(false);
  };

  const fetchFeatured = async () => {
    const res = await fetch("/api/products?featured=1");
    const data = await res.json();
    setFeatured(data);
  };

  const fetchBestseller = async () => {
    const res = await fetch("/api/products/bestseller");
    const data = await res.json();
    setBestseller(data);
  };

  const fetchByCategory = async () => {
    const categories = ["Baju", "Jaket", "Celana", "Aksesoris"];
    const result = {};
    for (const cat of categories) {
      const res = await fetch(`/api/products?category=${cat}`);
      result[cat] = await res.json();
    }
    setByCategory(result);
  };

  const fetchByGender = async () => {
    const genders = ["Pria", "Wanita"];
    const result = {};
    for (const gender of genders) {
      const res = await fetch(`/api/products?gender=${gender}`);
      result[gender] = await res.json();
    }
    setByGender(result);
  };

  const ProductCard = ({ product, index }) => (
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
          <div className="absolute top-3 left-3">
            <span className="text-xs font-medium text-white bg-emerald-600/80 backdrop-blur-sm px-2 py-1 rounded-full">
              {product.gender}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              {product.category}
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

  const ProductGrid = ({ products, title, icon, subtitle }) => (
    <div className="mb-16">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          {title}
        </h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse border border-emerald-100">
              <div className="h-48 bg-gradient-to-r from-emerald-100 to-teal-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-emerald-100 rounded-full w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-emerald-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );

  const CategorySection = ({ category, products }) => (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
        <div className="px-6">
          <h2 className="text-2xl font-bold text-gray-800 bg-white px-4 py-2 rounded-full border-2 border-emerald-200">
            {category}
          </h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
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
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Temukan <span className="text-emerald-200">Ketenangan</span><br />
                dalam Setiap Gaya
              </h1>
              <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                Serenity menghadirkan koleksi fashion terbaik dengan pengalaman berbelanja yang menenangkan dan menyenangkan
              </p>
              <Link 
                href="/product-list"
                className="inline-flex items-center space-x-2 bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Jelajahi Koleksi</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
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
        <ProductGrid 
          products={featured} 
          title="Produk Pilihan"
          icon="⭐"
          subtitle="Koleksi terbaik yang dipilih khusus untuk Anda"
        />

        <ProductGrid 
          products={bestseller} 
          title="Terlaris Minggu Ini"
          icon="🔥"
          subtitle="Produk favorit yang paling banyak diminati"
        />

        {Object.keys(byGender).map(gender => (
          <CategorySection 
            key={gender} 
            category={`Koleksi ${gender}`} 
            products={byGender[gender]} 
          />
        ))}

        {Object.keys(byCategory).map(category => (
          <CategorySection 
            key={category} 
            category={category} 
            products={byCategory[category]} 
          />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Bergabunglah dengan Komunitas Serenity
            </h2>
            <p className="text-emerald-100 mb-8 text-lg">
              Dapatkan update produk terbaru dan penawaran eksklusif
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 rounded-full border-0 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors">
                Berlangganan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}