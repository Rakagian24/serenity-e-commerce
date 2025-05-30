"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    setProduct(data);
  };

  const addToCart = async () => {
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ product_id: product.id, quantity: 1 }),
    });
    alert("Produk ditambahkan ke keranjang!");
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img src={product.image_url} className="w-full h-80 object-cover rounded" />
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.description}</h1>
            <p className="text-gray-600 mb-1">{product.category}</p>
            <p className="text-xl font-bold text-green-700 mb-4">Rp {parseInt(product.price).toLocaleString()}</p>
            <button onClick={addToCart} className="bg-blue-600 text-white px-4 py-2 rounded">
              Tambahkan ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
