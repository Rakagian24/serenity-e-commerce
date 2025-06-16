"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function AdminSidebar() {
  const { data: session } = useSession();
  const path = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const nav = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/orders", label: "Order List", icon: "📋" },
    { href: "/admin/transactions", label: "Transaksi", icon: "💰" },
    { href: "/admin/deliveries", label: "Pengiriman", icon: "🚚" },
    { href: "/admin/history", label: "Riwayat", icon: "📈" },
    { href: "/admin/products", label: "Kelola Produk", icon: "📦" },
    { href: "/admin/messages", label: "Pesan Chat", icon: "💬" },
    { href: "/admin/profile", label: "Profil Admin", icon: "👤" },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-emerald-50 via-white to-teal-50 h-screen fixed left-0 top-0 shadow-xl border-r border-emerald-100 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Serenity Admin</h2>
            <p className="text-emerald-100 text-sm">Management Panel</p>
          </div>
        </div>
      </div>


      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {nav.map((item) => {
          const isActive = path === item.href || (item.href !== "/admin" && path.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:transform hover:translate-x-1"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                isActive 
                  ? "bg-white/20 backdrop-blur-sm" 
                  : "bg-emerald-100 group-hover:bg-emerald-200"
              }`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-emerald-100">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          disabled={isLoggingOut}
          className={`w-full group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
            isLoggingOut
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "text-red-600 hover:bg-red-50 hover:text-red-700 hover:transform hover:translate-x-1"
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
            isLoggingOut 
              ? "bg-gray-200" 
              : "bg-red-100 group-hover:bg-red-200"
          }`}>
            {isLoggingOut ? "⏳" : "🚪"}
          </div>
          <span className="font-medium">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
          {!isLoggingOut && (
            <div className="ml-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}