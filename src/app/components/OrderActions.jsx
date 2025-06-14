"use client";
import { useState } from "react";

export default function OrderActions({ orderId }) {
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaintLoading, setComplaintLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/orders/${orderId}/confirm`, { method: "POST" });
      alert("Pesanan dikonfirmasi telah diterima!");
      window.location.reload();
    } catch (error) {
      alert("Terjadi kesalahan saat konfirmasi pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleComplaint = async () => {
    if (!complaint.trim()) {
      alert("Masukkan isi komplain");
      return;
    }
    
    setComplaintLoading(true);
    try {
      await fetch(`/api/admin/orders/${orderId}/complain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaint }),
      });
      alert("Komplain berhasil dikirim!");
      setComplaint("");
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim komplain");
    } finally {
      setComplaintLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Confirm Order */}
      <div>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Pesanan Diterima</span>
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">atau</span>
        </div>
      </div>

      {/* Complaint Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ajukan Komplain
          </label>
          <textarea
            placeholder="Jelaskan masalah atau keluhan Anda mengenai pesanan ini..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">
            {complaint.length}/500 karakter
          </p>
        </div>
        
        <button
          onClick={handleComplaint}
          disabled={complaintLoading || !complaint.trim()}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md flex items-center justify-center space-x-2"
        >
          {complaintLoading ? (
            <>
              <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <span>Kirim Komplain</span>
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-800 mb-1">Informasi</h4>
            <p className="text-sm text-blue-700">
              Konfirmasi pesanan jika Anda sudah menerima barang dengan kondisi baik. 
              Ajukan komplain jika ada masalah dengan pesanan Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}