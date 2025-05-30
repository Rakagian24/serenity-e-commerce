"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io(undefined, { path: "/api/socket" });

export default function ChatBox({ user, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef();

  useEffect(() => {
    socket.emit("join", user.id);

    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive-message", handleReceive);

    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, []);


  const sendMessage = async () => {
    if (!text.trim()) return;

    const msgData = {
      senderId: user.id,
      receiverId,
      message: text,
    };

    socket.emit("chat-message", msgData);

    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify(msgData),
    });

    setMessages((prev) => [...prev, msgData]);
    setText("");
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-lg p-3">
      <div className="font-bold mb-2">Live Chat</div>
      <div className="h-64 overflow-y-auto mb-2 border p-2 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-1 ${msg.senderId === user.id ? "text-right" : "text-left"}`}>
            <div className="bg-gray-200 inline-block px-3 py-1 rounded">{msg.message}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex">
        <input
          className="border flex-1 px-2 rounded-l"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-3 rounded-r" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
