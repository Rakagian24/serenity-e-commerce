"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

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
    <nav className="bg-white shadow p-4 flex justify-between items-center relative z-50">
      <Link href="/" className="text-2xl font-bold text-blue-600">Serenity</Link>

      <div className="flex items-center gap-4 relative">
        <Link href="/product-list" className="hover:text-blue-600">Produk</Link>

        {/* Ikon Keranjang */}
        {session?.user && (
          <div className="relative">
            <button onClick={() => setShowCart(!showCart)} className="relative">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dropdown Keranjang */}
            {showCart && (
              <div className="absolute right-0 top-8 bg-white border rounded shadow-md w-72 p-3 z-50">
                <h4 className="font-semibold mb-2">Keranjang</h4>
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500">Keranjang kosong</p>
                ) : (
                  <ul className="space-y-2">
                    {cartItems.map((item, i) => (
                      <li key={i} className="text-sm border-b pb-1">
                        {item.description} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href="/cart"
                  onClick={() => setShowCart(false)}
                  className="block mt-3 text-blue-600 hover:underline text-sm"
                >
                  Lihat semua
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <Link href="/admin/orders" className="hover:text-blue-600">Admin Panel</Link>
        )}

        {/* Auth */}
        {session ? (
          <>
            <Link href="/profile" className="hover:text-blue-600">Profil</Link>
            <button onClick={() => signOut()} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <button onClick={() => signIn("google")} className="bg-blue-600 text-white px-3 py-1 rounded">Login</button>
        )}
      </div>
    </nav>
  );
}
