"use client";

import { useState, useEffect } from "react";
import ChatBox from "./ChatBox";

export default function CustomerLiveChat({ user }) {
  const [showChat, setShowChat] = useState(false);

  const adminId = 1;

  if (!user || user.role !== "customer") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showChat ? (
        <ChatBox user={user} receiverId={adminId} />
      ) : (
        <button
          onClick={() => setShowChat(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          💬 Chat Admin
        </button>
      )}
    </div>
  );
}
