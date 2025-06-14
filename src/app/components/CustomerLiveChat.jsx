"use client";
import { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import { useLiveChat } from "./LiveChatProvider";

export default function CustomerLiveChat({ user }) {
  const [showChat, setShowChat] = useState(false);
  const { unreadCount, setUnreadCount } = useLiveChat();
  const adminId = 5;

  if (!user || user.role !== "customer") return null;

  const handleOpenChat = () => {
    setShowChat(true);
    setUnreadCount(0); // Reset unread count when chat is opened
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showChat ? (
        <div className="relative">
          <ChatBox user={user} receiverId={adminId} onClose={handleCloseChat} />
        </div>
      ) : (
        <button
          onClick={handleOpenChat}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-1"
        >
          <span className="text-xl">💬</span>
          <span className="font-semibold">Chat Admin</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs min-w-6 h-6 flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

