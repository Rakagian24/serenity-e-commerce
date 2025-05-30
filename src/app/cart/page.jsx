"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
  };

  const removeItem = async (id) => {
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Keranjang</h1>
        {cart.length === 0 ? (
          <p>Keranjang kosong.</p>
        ) : (
          <>
            <table className="w-full border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Produk</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Total</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2">{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>Rp {item.price.toLocaleString()}</td>
                    <td>Rp {(item.price * item.quantity).toLocaleString()}</td>
                    <td>
                      <button onClick={() => removeItem(item.id)} className="text-red-500">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between">
              <p className="font-bold">Total: Rp {total.toLocaleString()}</p>
              <Link href="/checkout" className="bg-blue-600 text-white px-4 py-2 rounded">Checkout</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
