"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import CustomerLiveChat from "./CustomerLiveChat";

const LiveChatContext = createContext();

export function useLiveChat() {
  return useContext(LiveChatContext);
}

export default function LiveChatProvider({ children, user }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const socketInstance = io(undefined, { path: "/api/socket" });
      setSocket(socketInstance);

      // Tambahkan validasi di sini
      if (user.id) {
        socketInstance.emit("join", user.id);
      } else {
        console.warn("❗️User ID not found on socket init", user);
      }

      socketInstance.on("receive-message", (data) => {
        setMessages(prev => [...prev, data]);
        setUnreadCount(prev => prev + 1);

        if (Notification.permission === "granted") {
          new Notification("Pesan Baru dari Serenity", {
            body: data.message,
            icon: "/icon-192x192.png",
            badge: "/icon-192x192.png"
          });
        }
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user]);


  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const value = {
    socket,
    messages,
    setMessages,
    unreadCount,
    setUnreadCount
  };

  return (
    <LiveChatContext.Provider value={value}>
      {children}
      {/* Live chat akan muncul di semua halaman untuk customer */}
      {user && user.role === "customer" && (
        <CustomerLiveChat user={user} />
      )}
    </LiveChatContext.Provider>
  );
}