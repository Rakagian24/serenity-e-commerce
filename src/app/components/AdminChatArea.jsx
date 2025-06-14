"use client";
import { useEffect, useState, useRef } from "react";
import { useLiveChat } from "./LiveChatProvider";

export default function AdminChatArea({ user, receiverId, customerData }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const endRef = useRef();
  const { socket } = useLiveChat();

  // Get customer info
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (!customerData && receiverId) {
        try {
          const res = await fetch(`/api/customers/${receiverId}`);
          if (res.ok) {
            const data = await res.json();
            setCustomerInfo(data);
          }
        } catch (error) {
          console.error("Error fetching customer info:", error);
        }
      } else {
        setCustomerInfo(customerData);
      }
    };
    fetchCustomerInfo();
  }, [receiverId, customerData]);

  // Load message history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/messages/history?senderId=${user.id}&receiverId=${receiverId}`);
        
        if (res.ok) {
          const history = await res.json();
          setMessages(history);
        } else {
          console.error("Failed to load message history");
        }
      } catch (error) {
        console.error("Error loading message history:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user.id && receiverId) {
      loadHistory();
    }
  }, [user.id, receiverId]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;
    const handleReceive = (data) => {
      if ((data.senderId === receiverId && data.receiverId === user.id) ||
          (data.senderId === user.id && data.receiverId === receiverId)) {
        
        setMessages((prev) => {
          const exists = prev.some(msg => 
            msg.senderId === data.senderId && 
            msg.receiverId === data.receiverId && 
            msg.message === data.message &&
            Math.abs(new Date(msg.timestamp) - new Date(data.timestamp)) < 1000
          );
          
          if (!exists) {
            return [...prev, data];
          }
          return prev;
        });
      }
    };
    socket.on("receive-message", handleReceive);
    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [socket, user.id, receiverId]);

  // Auto scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !socket || sending) return;
    const messageText = text.trim();
    setText("");
    setSending(true);
    const msgData = {
      senderId: user.id,
      receiverId,
      message: messageText,
      timestamp: new Date().toISOString()
    };
    try {
      setMessages((prev) => [...prev, msgData]);
      socket.emit("chat-message", msgData);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId,
          message: messageText
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save message');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => 
        prev.filter(msg => !(
          msg.senderId === user.id && 
          msg.receiverId === receiverId && 
          msg.message === messageText
        ))
      );
      setText(messageText);
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Baru saja' : `${diffInMinutes} menit lalu`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return `Kemarin ${date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getCustomerDisplayName = () => {
    if (!customerInfo) return 'Customer';
    return customerInfo.name || customerInfo.email?.split('@')[0] || 'Customer';
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Chat Header - Fixed height */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-500 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(getCustomerDisplayName())}
          </div>
          <div>
            <h2 className="font-bold">{getCustomerDisplayName()}</h2>
            <div className="flex items-center gap-2 text-emerald-100">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
              <span className="text-sm">Online</span>
            </div>
          </div>
        </div>
        
        {customerInfo && (
          <div className="text-right text-emerald-100">
            <p className="text-sm">{customerInfo.email}</p>
            <p className="text-xs">Customer ID: {receiverId}</p>
          </div>
        )}
      </div>

      {/* Messages Area - Flexible height */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="text-emerald-600 font-medium">Memuat pesan...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Belum ada percakapan</h3>
            <p className="text-center max-w-md text-sm">Mulai percakapan dengan mengirim pesan pertama kepada customer ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={`${msg.id || i}-${msg.timestamp}`} className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  msg.senderId === user.id 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-md" 
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                }`}>
                  <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">{msg.message}</div>
                  <div className={`text-xs mt-2 ${
                    msg.senderId === user.id ? "text-emerald-100" : "text-gray-500"
                  }`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Message Input - Fixed height */}
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex gap-3 mb-3">
          <textarea
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all"
            placeholder="Ketik balasan Anda..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            rows={3}
          />
          <button 
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 flex items-center gap-2 ${
              text.trim() && !sending
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 cursor-pointer shadow-md hover:shadow-lg" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={sendMessage}
            disabled={!text.trim() || sending}
          >
            {sending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Mengirim</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Kirim</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </div>
            )}
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setText("Terima kasih telah menghubungi kami. Ada yang bisa saya bantu?")}
            className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors"
          >
            Salam pembuka
          </button>
          <button 
            onClick={() => setText("Baik, saya akan segera membantu Anda menyelesaikan masalah ini.")}
            className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors"
          >
            Konfirmasi bantuan
          </button>
          <button 
            onClick={() => setText("Terima kasih telah menghubungi customer service kami. Semoga harimu menyenangkan!")}
            className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors"
          >
            Penutup
          </button>
        </div>
      </div>
    </div>
  );
}