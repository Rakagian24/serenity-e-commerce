"use client";

import { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import { useLiveChat } from "./LiveChatProvider";

export default function CustomerLiveChat({ user }) {
  const [showChat, setShowChat] = useState(false);
  const { unreadCount, setUnreadCount } = useLiveChat();
  const adminId = 1;

  if (!user || user.role !== "customer") return null;

  const handleOpenChat = () => {
    setShowChat(true);
    setUnreadCount(0); // Reset unread count when chat is opened
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showChat ? (
        <div className="relative">
          <button
            onClick={handleCloseChat}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
          <ChatBox user={user} receiverId={adminId} onClose={handleCloseChat} />
        </div>
      ) : (
        <button
          onClick={handleOpenChat}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200"
        >
          💬 Chat Admin
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs min-w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}