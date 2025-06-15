"use client";
import { useState } from "react";

export default function OrderActions({ id, status }) {
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleContinuePayment = async () => {
    setPaymentLoading(true);
    try {
      const response = await fetch(`/api/orders/${id}/continue-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.redirect_url) {
        // Redirect ke halaman pembayaran Midtrans
        window.open(data.redirect_url, '_blank');
      } else {
        alert(data.message || "Gagal melanjutkan pembayaran");
      }
    } catch (error) {
      console.error("Error continuing payment:", error);
      alert("Terjadi kesalahan saat melanjutkan pembayaran");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/orders/${id}/confirm`, { method: "POST" });
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
      await fetch(`/api/admin/orders/${id}/complain`, {
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

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const response = await fetch(`/api/orders/${id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Pesanan berhasil dibatalkan!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Gagal membatalkan pesanan");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat membatalkan pesanan");
    } finally {
      setCancelLoading(false);
      setShowCancelConfirm(false);
    }
  };

  // Check if cancel is allowed based on status
  const canCancel = ['pending', 'paid', 'processing'].includes(status);
  
  // Check if payment can be continued (only for pending status)
  const canContinuePayment = status === 'pending';

  return (
    <div className="space-y-6">
      {/* Continue Payment Button - Only show for pending status */}
      {canContinuePayment && (
        <div>
          <button
            onClick={handleContinuePayment}
            disabled={paymentLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md flex items-center justify-center space-x-2"
          >
            {paymentLoading ? (
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span>Lanjutkan Pembayaran</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Cancel Order Button - Only show if status allows cancellation */}
      {canCancel && (
        <div>
          <button
            onClick={() => setShowCancelConfirm(true)}
            disabled={cancelLoading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span>Batalkan Pesanan</span>
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Batalkan Pesanan?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  disabled={cancelLoading}
                >
                  Batal
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {cancelLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Membatalkan...
                    </>
                  ) : (
                    "Ya, Batalkan"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Divider - Only show if there are buttons above */}
      {(canContinuePayment || canCancel) && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">atau</span>
          </div>
        </div>
      )}

      {/* Confirm Order - Only show if not pending */}
      {status !== 'pending' && (
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
      )}

      {/* Divider - Only show if confirm button is shown */}
      {status !== 'pending' && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">atau</span>
          </div>
        </div>
      )}

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
              {status === 'pending' && "Lanjutkan pembayaran untuk menyelesaikan pesanan Anda. "}
              {canCancel && "Anda dapat membatalkan pesanan sebelum barang dikirim. "}
              {status !== 'pending' && "Konfirmasi pesanan jika Anda sudah menerima barang dengan kondisi baik. "}
              Ajukan komplain jika ada masalah dengan pesanan Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}