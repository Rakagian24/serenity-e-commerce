"use client";

import AdminSidebar from "@/app/components/AdminSidebar";
import ChatBox from "@/app/components/ChatBox";
import { useEffect, useState } from "react";

export default function AdminMessagesPage() {
  const adminUser = { id: 1, role: "admin" }; 
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchSenders = async () => {
      const res = await fetch("/api/messages/senders");
      const data = await res.json();
      setCustomers(data);
    };
    fetchSenders();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Live Chat Customer</h1>
        <div className="flex gap-6">
          <aside className="w-64">
            <h2 className="font-semibold mb-2">Daftar Customer</h2>
            <ul>
              {customers.map(c => (
                <li key={c.id}>
                  <button
                    className={`block w-full text-left px-3 py-2 rounded ${selectedCustomer === c.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedCustomer(c.id)}
                  >
                    {c.name || c.email}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="flex-1">
            {selectedCustomer ? (
              <ChatBox user={adminUser} receiverId={selectedCustomer} />
            ) : (
              <p className="text-gray-500">Pilih customer untuk mulai percakapan</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
