"use client";

import { useState } from "react";

export default function OrderActions({ orderId }) {
  const [complaint, setComplaint] = useState("");

  const handleConfirm = async () => {
    await fetch(`/api/orders/${orderId}/confirm`, { method: "POST" });
    alert("Pesanan dikonfirmasi telah diterima!");
  };

  const handleComplaint = async () => {
    if (!complaint) return alert("Masukkan isi komplain");

    await fetch(`/api/orders/${orderId}/complain`, {
      method: "POST",
      body: JSON.stringify({ complaint }),
    });

    alert("Komplain berhasil dikirim!");
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleConfirm}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Konfirmasi Pesanan Diterima
      </button>

      <div>
        <textarea
          placeholder="Ajukan komplain..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleComplaint}
          className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
        >
          Ajukan Komplain
        </button>
      </div>
    </div>
  );
}
