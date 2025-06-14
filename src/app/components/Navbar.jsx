"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
        setCartCount(data.length);
      }
    };

    if (session?.user) fetchCart();
  }, [session]);

  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100' 
        : 'bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Serenity
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-medium"
            >
              Beranda
            </Link>
            <Link 
              href="/product-list" 
              className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-medium"
            >
              Katalog
            </Link>

            {session?.user && (
              <div className="relative">
                <button 
                  onClick={() => setShowCart(!showCart)} 
                  className="relative p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L8 8m0 5v6m0 0v3m0-3h8m-8 0H5.4"/>
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-semibold animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </button>

                {showCart && (
                  <div className="absolute right-0 top-12 bg-white border border-emerald-100 rounded-xl shadow-xl w-80 p-4 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Keranjang Belanja</h4>
                      <button 
                        onClick={() => setShowCart(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L8 8"/>
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">Keranjang masih kosong</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {cartItems.map((item, i) => (
                          <div key={i} className="flex items-center space-x-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <span className="text-emerald-600 font-medium text-sm">{item.quantity}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link
                      href="/cart"
                      onClick={() => setShowCart(false)}
                      className="block w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium"
                    >
                      Lihat Keranjang
                    </Link>
                  </div>
                )}
              </div>
            )}

            {isAdmin && (
              <Link 
                href="/admin/orders" 
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-medium"
              >
                Admin Panel
              </Link>
            )}

            {session ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium hidden sm:block">Profil</span>
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => signIn("credentials", { callbackUrl: "/" })} 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}