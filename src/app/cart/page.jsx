"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
    console.log("Cart data:", data);
    setLoading(false);
  };

  const removeItem = async (id) => {
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    fetchCart();
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity: newQuantity })
    });
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.4 9M7 13l-1.4-9m0 0h16"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Keranjang <span className="text-emerald-200">Belanja</span>
              </h1>
              <p className="text-emerald-100 max-w-2xl mx-auto">
                Tinjau produk pilihan Anda sebelum melanjutkan ke pembayaran
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse border border-emerald-100">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-emerald-100 rounded w-1/2" />
                    <div className="h-6 bg-emerald-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.4 9M7 13l-1.4-9m0 0h16"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Keranjang Masih Kosong</h2>
            <p className="text-gray-600 mb-8">Belum ada produk yang ditambahkan ke keranjang Anda</p>
            <Link 
              href="/product-list"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Mulai Berbelanja</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-emerald-100">
                  <div className="p-6">
                    <div className="flex items-center space-x-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.description}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">{item.description}</h3>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            {item.category || 'Produk'}
                          </span>
                          <p className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Rp {parseInt(item.price).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-600 flex items-center justify-center transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
                          </svg>
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-600 flex items-center justify-center transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                          </svg>
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-800">
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors mt-1"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
                <h2 className="text-xl font-bold text-gray-800">Ringkasan Pesanan</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                    <span>Rp {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="text-emerald-600 font-medium">Gratis</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Rp {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Link 
                href="/product-list"
                className="flex-1 bg-white border-2 border-emerald-200 text-emerald-600 px-6 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 text-center"
              >
                Lanjut Belanja
              </Link>
              <Link 
                href="/checkout"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
              >
                Lanjut ke Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}