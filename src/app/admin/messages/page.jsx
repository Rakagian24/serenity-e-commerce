"use client";

import AdminSidebar from "@/app/components/AdminSidebar";
import ChatBox from "@/app/components/ChatBox";
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="ml-64 flex-1 flex">
        {/* Customer List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Live Chat</h1>
            <p className="text-sm text-gray-500 mt-1">
              {customers.length} customer terdaftar
            </p>
          </div>

          {/* Customer List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Memuat customer...</span>
                </div>
              </div>
            ) : customers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">Belum ada customer yang mengirim pesan</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {customers.map(customer => (
                  <button
                    key={customer.id}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedCustomer === customer.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                    }`}
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {getCustomerDisplayName(customer).charAt(0).toUpperCase()}
                        </div>
                        {/* Online indicator */}
                        {isCustomerOnline(customer.id) && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {getCustomerDisplayName(customer)}
                          </h3>
                          {isCustomerOnline(customer.id) && (
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-500 truncate">
                          {customer.email}
                        </p>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">
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
        <div className="flex-1 flex items-center justify-center">
          {selectedCustomer ? (
            <div className="w-full max-w-2xl mx-auto p-6">
              <ChatBox 
                user={adminUser} 
                receiverId={selectedCustomer}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Pilih Customer untuk Memulai Chat
              </h2>
              <p className="text-gray-500">
                Pilih customer dari daftar di samping untuk memulai percakapan
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}