"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
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
    const res = await fetch("/api/checout");
    const data = await res.json();
    setShippingInfo({
      name: data.shipping_name,
      phone: data.shipping_phone,
      address: data.shipping_address,
    });
  };


  const handleCheckout = async () => {
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
      },
      onClose: function () {
        alert("Transaksi dibatalkan");
      },
    });
  }
};

  useEffect(() => {
    fetchCart();
    fetchShippingInfo();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p>Total Belanja: Rp {total.toLocaleString()}</p>
        <div className="border p-4 rounded mb-4">
        <h3 className="text-lg font-bold mb-2">Alamat Pengiriman</h3>
        <p><strong>Nama:</strong> {shippingInfo.name}</p>
        <p><strong>HP:</strong> {shippingInfo.phone}</p>
        <p><strong>Alamat:</strong> {shippingInfo.address}</p>
        <Link href="/profile" className="text-blue-600 text-sm underline">Edit di profil</Link>
        </div>
        <button
          onClick={handleCheckout}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Bayar Sekarang"}
        </button>
      </div>
      <script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}>
      </script>
    </div>    
  );
}
