"use client";
import { useEffect, useState, useRef } from "react";
import { useLiveChat } from "./LiveChatProvider";

export default function ChatBox({ user, receiverId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef();
  const { socket } = useLiveChat();

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
      // Only add message if it's relevant to this conversation
      if ((data.senderId === receiverId && data.receiverId === user.id) ||
          (data.senderId === user.id && data.receiverId === receiverId)) {
        
        setMessages((prev) => {
          // Avoid duplicate messages
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
    setText(""); // Clear input immediately for better UX
    setSending(true);
    const msgData = {
      senderId: user.id,
      receiverId,
      message: messageText,
      timestamp: new Date().toISOString()
    };
    try {
      // Add to local state optimistically
      setMessages((prev) => [...prev, msgData]);
      // Emit to socket
      socket.emit("chat-message", msgData);
      // Save to database
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
      
      // Remove the optimistically added message on error
      setMessages((prev) => 
        prev.filter(msg => !(
          msg.senderId === user.id && 
          msg.receiverId === receiverId && 
          msg.message === messageText
        ))
      );
      
      // Restore the text
      setText(messageText);
      
      // Show error to user (you might want to use a toast notification)
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
    if (diffInHours < 24) {
      // Today - show only time
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      // Yesterday
      return `Kemarin ${date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else {
      // Older - show date and time
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getReceiverName = () => {
    if (user.role === 'admin') {
      return 'Customer';
    }
    return 'Admin';
  };

  return (
    <div className="w-80 bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-200 rounded-full animate-pulse"></div>
          <div>
            <div className="font-semibold">Chat dengan {getReceiverName()}</div>
            <div className="text-xs text-emerald-100">Online</div>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-white hover:text-emerald-100 text-xl w-6 h-6 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
              <span className="text-sm">Memuat pesan...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500 text-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p>Belum ada pesan. Mulai percakapan!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={`${msg.id || i}-${msg.timestamp}`} className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                  msg.senderId === user.id 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-md" 
                    : "bg-white text-gray-800 border border-emerald-100 rounded-bl-md"
                }`}>
                  <div className="text-sm leading-relaxed break-words">{msg.message}</div>
                  <div className={`text-xs mt-1 ${
                    msg.senderId === user.id ? "text-emerald-100" : "text-gray-500"
                  }`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-emerald-100 bg-white">
        <div className="flex gap-2">
          <input
            className="flex-1 border border-emerald-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
            placeholder="Ketik pesan..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
          />
          <button 
            className={`px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-300 ${
              text.trim() && !sending
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 cursor-pointer shadow-md hover:shadow-lg" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={sendMessage}
            disabled={!text.trim() || sending}
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Kirim"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

