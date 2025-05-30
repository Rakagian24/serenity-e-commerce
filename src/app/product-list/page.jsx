"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function PublicCatalog() {
  const [products, setProducts] = useState([]);
  const [kategori, setKategori] = useState("Semua");
  const [sort, setSort] = useState(""); // "" | asc | desc
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (kategori !== "Semua") params.append("category", kategori);
    if (sort) params.append("sort", sort);
    if (search) params.append("q", search);

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [kategori, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = ["Semua", "Pria", "Wanita", "Baju", "Jaket", "Celana", "Aksesoris"];

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-4">Katalog Produk</h1>

        {/* Search & Sort */}
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Cari produk..."
            className="border p-2 flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="border p-2" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Urutkan</option>
            <option value="asc">Harga Termurah</option>
            <option value="desc">Harga Termahal</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 rounded">Cari</button>
        </form>

        {/* Filter Kategori */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setKategori(cat)}
              className={`px-3 py-1 rounded border ${kategori === cat ? "bg-blue-600 text-white" : "bg-white text-black"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Daftar Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="border rounded-lg shadow p-4 cursor-pointer hover:shadow-md">
                <img src={product.image_url} alt="foto" className="w-full h-40 object-cover rounded" />
                <h2 className="font-semibold mt-2">{product.description}</h2>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-lg font-bold mt-1">Rp {parseInt(product.price).toLocaleString()}</p>
                {product.is_featured && (
                  <span className="text-xs text-yellow-600 font-bold">⭐ Featured</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
