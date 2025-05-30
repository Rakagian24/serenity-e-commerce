"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestseller, setBestseller] = useState([]);
  const [byCategory, setByCategory] = useState({});

  useEffect(() => {
    fetchFeatured();
    fetchBestseller();
    fetchByCategory();
  }, []);

  const fetchFeatured = async () => {
    const res = await fetch("/api/products?featured=1");
    const data = await res.json();
    setFeatured(data);
  };

  const fetchBestseller = async () => {
    const res = await fetch("/api/products/bestseller");
    const data = await res.json();
    setBestseller(data);
  };

  const fetchByCategory = async () => {
    const categories = ["Pria", "Wanita", "Baju", "Jaket", "Celana", "Aksesoris"];
    const result = {};
    for (const cat of categories) {
      const res = await fetch(`/api/products?category=${cat}`);
      result[cat] = await res.json();
    }
    setByCategory(result);
  };

  const ProductGrid = ({ products }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {products.map(p => (
        <Link key={p.id} href={`/product/${p.id}`}>
          <div className="border rounded p-2 hover:shadow">
            <img src={p.image_url} className="h-40 w-full object-cover rounded" />
            <h3 className="font-semibold">{p.description}</h3>
            <p className="text-sm text-gray-500">{p.category}</p>
            <p className="font-bold text-green-600">Rp {parseInt(p.price).toLocaleString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-2">⭐ Produk Featured</h2>
        <ProductGrid products={featured} />

        <h2 className="text-2xl font-bold mb-2">🔥 Produk Terlaris</h2>
        <ProductGrid products={bestseller} />

        {Object.keys(byCategory).map(cat => (
          <div key={cat}>
            <h2 className="text-2xl font-bold mt-6 mb-2">{cat}</h2>
            <ProductGrid products={byCategory[cat]} />
          </div>
        ))}
      </div>
    </div>
  );
}
