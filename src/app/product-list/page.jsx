"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    setProduct(data);
    setLoading(false);
  };

  const addToCart = async () => {
    setAddingToCart(true);
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ product_id: product.id, quantity }),
    });
    setAddingToCart(false);
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center space-x-2';
    alertDiv.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>Produk berhasil ditambahkan ke keranjang!</span>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-96 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-emerald-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-emerald-100 rounded w-1/4 animate-pulse" />
                <div className="h-6 bg-emerald-100 rounded w-1/3 animate-pulse" />
                <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-12 bg-emerald-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <Navbar />
        <div className="pt-16 text-center py-32">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Produk Tidak Ditemukan</h1>
          <Link href="/product-list" className="text-emerald-600 hover:text-emerald-700">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Beranda
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
              <Link href="/product-list" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Katalog
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
              <span className="text-gray-600">{product.description}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
                <img 
                  src={product.image_url} 
                  alt={product.description}
                  className="w-full h-96 object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
              
              {/* Thumbnail Gallery (placeholder) */}
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-100">
                    <img 
                      src={product.image_url} 
                      alt={`${product.description} ${i + 1}`}
                      className="w-full h-20 object-cover opacity-60 hover:opacity-100 transition-opacity cursor-pointer" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Title & Category */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  {product.is_featured && (
                    <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full flex items-center space-x-1">
                      <span>⭐</span>
                      <span>Featured</span>
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {product.description}
                </h1>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Rp {parseInt(product.price).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">Harga sudah termasuk pajak</p>
              </div>

              {/* Product Description */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Deskripsi Produk</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description} - Produk berkualitas tinggi dengan desain modern dan nyaman digunakan. 
                  Terbuat dari bahan premium yang tahan lama dan cocok untuk berbagai aktivitas sehari-hari.
                </p>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-4 mb-6">
                  <label className="text-sm font-medium text-gray-700">Jumlah:</label>
                  <div className="flex items-center border border-emerald-200 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-emerald-50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
                      </svg>
                    </button>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center py-2 border-0 focus:ring-0"
                      min="1"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-emerald-50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={addToCart}
                  disabled={addingToCart}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    addingToCart 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Menambahkan...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                      </svg>
                      <span>Tambahkan ke Keranjang</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-emerald-100">
                  <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <span>Wishlist</span>
                  </button>
                  <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                    <span>Bagikan</span>
                  </button>
                </div>
              </div>

              {/* Product Features */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Keunggulan Produk</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Kualitas Premium</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Pengiriman Cepat</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Garansi Resmi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Return Policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to catalog */}
          <div className="mt-12 text-center">
            <Link 
              href="/product-list"
              className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>Kembali ke Katalog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}