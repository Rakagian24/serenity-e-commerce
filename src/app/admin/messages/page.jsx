"use client";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminChatArea from "@/app/components/AdminChatArea";
import { useEffect, useState } from "react";

export default function AdminMessagesPage() {
  const adminUser = { id: 1, role: "admin" }; 
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/messages/senders");
        
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        } else {
          console.error("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSenders();
  }, []);

  // Listen for online status updates
  useEffect(() => {
    const simulateOnlineStatus = () => {
      const randomCustomers = customers
        .filter(() => Math.random() > 0.5)
        .map(c => c.id);
      setOnlineUsers(new Set(randomCustomers));
    };
    if (customers.length > 0) {
      simulateOnlineStatus();
      const interval = setInterval(simulateOnlineStatus, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [customers]);

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Baru saja' : `${diffInMinutes} menit lalu`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} jam lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  const getCustomerDisplayName = (customer) => {
    return customer.name || customer.email.split('@')[0];
  };

  const isCustomerOnline = (customerId) => {
    return onlineUsers.has(customerId);
  };

  const getSelectedCustomerData = () => {
    return customers.find(c => c.id === selectedCustomer);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      <AdminSidebar />
      <main className="ml-72 flex-1 flex overflow-hidden">
        {/* Customer List Sidebar */}
        <div className="w-80 bg-white border-r border-emerald-100 flex flex-col shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">Live Chat</h2>
              <p className="text-emerald-100 text-sm leading-tight">1 customer terdaftar</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="p-4 border-b border-emerald-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari customer..."
                className="w-full pl-9 pr-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          {/* Customer List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="flex items-center gap-2 text-emerald-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                  <span className="text-sm">Memuat customer...</span>
                </div>
              </div>
            ) : customers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-sm">Belum ada customer yang mengirim pesan</p>
              </div>
            ) : (
              <div>
                {customers.map(customer => (
                  <button
                    key={customer.id}
                    className={`w-full text-left p-4 hover:bg-emerald-50 transition-all duration-300 border-b border-emerald-50 ${
                      selectedCustomer === customer.id ? 'bg-emerald-50 border-r-4 border-emerald-600' : ''
                    }`}
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center text-white font-semibold shadow-md">
                          {getCustomerDisplayName(customer).charAt(0).toUpperCase()}
                        </div>
                        {/* Online indicator */}
                        {isCustomerOnline(customer.id) && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      {/* Customer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {getCustomerDisplayName(customer)}
                          </h3>
                          {isCustomerOnline(customer.id) && (
                            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                              Online
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-500 truncate mb-2">
                          {customer.email}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            {customer.message_count} pesan
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatLastMessageTime(customer.last_message_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-6">
          {selectedCustomer ? (
            <AdminChatArea 
              user={adminUser} 
              receiverId={selectedCustomer}
              customerData={getSelectedCustomerData()}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-6">
                  <span className="text-4xl">💬</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                  Pilih Customer untuk Memulai Chat
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Pilih customer dari daftar di samping untuk memulai percakapan dan memberikan layanan terbaik
                </p>
                
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-600">{customers.length}</div>
                    <div className="text-sm text-gray-500">Total Customer</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md border border-emerald-100">
                    <div className="text-2xl font-bold text-teal-600">{onlineUsers.size}</div>
                    <div className="text-sm text-gray-500">Sedang Online</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}