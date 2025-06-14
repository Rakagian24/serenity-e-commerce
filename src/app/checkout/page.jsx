"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
  };

  const fetchShippingInfo = async () => {
    const res = await fetch("/api/checkout");
    const data = await res.json();
    setShippingInfo({
      name: data.shipping_name,
      phone: data.shipping_phone,
      address: data.shipping_address,
    });
  };

  const loadMidtransScript = () => {
  return new Promise((resolve, reject) => {
      if (window.snap) return resolve(); // Sudah tersedia
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
      script.onload = () => resolve();
      script.onerror = () => reject("Gagal memuat Midtrans Snap script");
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      await loadMidtransScript(); // pastikan script dimuat

      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: function (result) {
            alert("Pembayaran berhasil!");
            router.push("/profile");
          },
          onPending: function (result) {
            alert("Pembayaran pending...");
            router.push("/profile");
          },
          onError: function (result) {
            alert("Pembayaran gagal!");
            setLoading(false);
          },
          onClose: function () {
            alert("Transaksi dibatalkan");
            setLoading(false);
          },
        });
      } else {
        alert("Gagal mendapatkan token Midtrans");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memuat pembayaran");
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);
      await Promise.all([fetchCart(), fetchShippingInfo()]);
      setPageLoading(false);
    };
    loadData();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 0;
  const finalTotal = total + shippingCost;

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                <span className="text-emerald-200">Checkout</span> Pesanan
              </h1>
              <p className="text-emerald-100 max-w-2xl mx-auto">
                Langkah terakhir untuk menyelesaikan pesanan Anda
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
        {pageLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column Loading */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse border border-emerald-100">
                <div className="h-6 bg-emerald-100 rounded w-1/3 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse border border-emerald-100">
                <div className="h-6 bg-emerald-100 rounded w-1/4 mb-4" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-emerald-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right Column Loading */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-emerald-100">
              <div className="h-6 bg-emerald-100 rounded w-1/2 mb-6" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="border-t pt-4">
                  <div className="h-6 bg-emerald-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      Alamat Pengiriman
                    </h2>
                    <Link 
                      href="/profile" 
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {shippingInfo.name ? (
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-700 w-20">Nama:</span>
                        <span className="text-gray-800">{shippingInfo.name}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-700 w-20">HP:</span>
                        <span className="text-gray-800">{shippingInfo.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-700 w-20">Alamat:</span>
                        <span className="text-gray-800">{shippingInfo.address}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-4">Alamat pengiriman belum lengkap</p>
                      <Link 
                        href="/profile"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                      >
                        Lengkapi Profil
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    Pesanan Anda ({cart.length} item{cart.length > 1 ? 's' : ''})
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                            {item.image_url ? (
                              <img 
                                src={item.image_url} 
                                alt={item.description}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.description}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">
                            Rp {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden h-fit sticky top-8">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  Ringkasan Pesanan
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="text-emerald-600 font-medium">Gratis</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Rp {finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || !shippingInfo.name || cart.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      <span>Bayar Sekarang</span>
                    </>
                  )}
                </button>

                {(!shippingInfo.name || cart.length === 0) && (
                  <p className="text-sm text-gray-500 text-center mt-3">
                    {!shippingInfo.name ? "Lengkapi alamat pengiriman untuk melanjutkan" : "Keranjang kosong"}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link 
                    href="/cart"
                    className="w-full bg-white border-2 border-emerald-200 text-emerald-600 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 text-center block"
                  >
                    Kembali ke Keranjang
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}>
      </script>
    </div>    
  );
}