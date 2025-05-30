"use client";

import { useState, useEffect } from "react";

export default function ProductAdminPage() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    image_url: "",
    description: "",
    price: "",
    category: "Baju",
    is_featured: false,
    is_active: true,
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetch(`/api/admin/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({
      image_url: "",
      description: "",
      price: "",
      category: "Baju",
      is_featured: false,
      is_active: true,
    });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      image_url: product.image_url,
      description: product.description,
      price: product.price,
      category: product.category,
      is_featured: !!product.is_featured,
      is_active: !!product.is_active,
    });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{editingId ? "Edit Produk" : "Tambah Produk"}</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="text" placeholder="URL Foto" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="border p-2" required />
        <textarea placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2" required />
        <input type="number" placeholder="Harga" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border p-2" required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2">
          {["Pria", "Wanita", "Baju", "Jaket", "Celana", "Aksesoris"].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
          Featured Produk
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Aktif
        </label>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            {editingId ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  image_url: "",
                  description: "",
                  price: "",
                  category: "Baju",
                  is_featured: false,
                  is_active: true,
                });
              }}
              className="bg-gray-400 text-white py-2 px-4 rounded"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mt-6 mb-2">Daftar Produk</h3>
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="border p-2 flex justify-between items-center">
            <div>
              <p className="font-bold">{p.description}</p>
              <p>{p.category} - Rp {parseInt(p.price).toLocaleString()}</p>
              <p className="text-sm text-gray-600">{p.is_featured ? "⭐ Featured" : ""} {p.is_active ? "" : "(Nonaktif)"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
              <button onClick={async () => {
                await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
                fetchProducts();
              }} className="text-red-600">Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
