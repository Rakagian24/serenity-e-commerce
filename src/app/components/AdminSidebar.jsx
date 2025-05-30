// components/AdminSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const path = usePathname();

  const nav = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/orders", label: "Order List" },
    { href: "/admin/transactions", label: "Transaksi" },
    { href: "/admin/deliveries", label: "Pengiriman" },
    { href: "/admin/history", label: "Riwayat" },
    { href: "/admin/products", label: "Kelola Produk" },
  ];

  return (
    <aside className="w-64 bg-gray-100 h-screen fixed left-0 top-0 p-6 space-y-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block px-3 py-2 rounded ${
            path.startsWith(item.href)
              ? "bg-blue-600 text-white"
              : "text-gray-800 hover:bg-blue-100"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
