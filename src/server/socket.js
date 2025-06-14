import { Server } from "socket.io";

export default function initSocket(server) {
  const io = new Server(server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === "production" ? false : "*",
      methods: ["GET", "POST"]
    }
  });

  // Store active users
  const activeUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle user joining
    socket.on("join", (userId) => {
      console.log(`User ${userId} joined`);
      
      // Store user info
      activeUsers.set(socket.id, {
        userId: userId,
        socketId: socket.id,
        joinedAt: new Date()
      });

      // Join user to their own room
      socket.join(userId.toString());

      // Broadcast user online status
      socket.broadcast.emit("user-status", {
        userId: userId,
        status: "online"
      });

      // Send current online users to the newly connected user
      const onlineUsers = Array.from(activeUsers.values()).map(user => ({
        userId: user.userId,
        status: "online"
      }));
      
      socket.emit("online-users", onlineUsers);
    });

    // Handle chat messages
    socket.on("chat-message", (data) => {
      console.log("Message received:", data);
      
      const { senderId, receiverId, message, timestamp } = data;
      
      // Validate message data
      if (!senderId || !receiverId || !message) {
        socket.emit("error", { message: "Invalid message data" });
        return;
      }

      // Create message object with server timestamp
      const messageData = {
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        message: message.trim(),
        timestamp: timestamp || new Date().toISOString()
      };

      // Send message to receiver
      socket.to(receiverId.toString()).emit("receive-message", messageData);
      
      // Also send back to sender for confirmation (optional)
      // socket.emit("message-sent", messageData);

      console.log(`Message sent from ${senderId} to ${receiverId}`);
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
      socket.to(data.receiverId.toString()).emit("user-typing", {
        userId: data.senderId,
        isTyping: true
      });
    });

    socket.on("stop-typing", (data) => {
      socket.to(data.receiverId.toString()).emit("user-typing", {
        userId: data.senderId,
        isTyping: false
      });
    });

    // Handle message read status
    socket.on("mark-as-read", (data) => {
      socket.to(data.senderId.toString()).emit("message-read", {
        messageIds: data.messageIds,
        readBy: data.readBy
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      
      const user = activeUsers.get(socket.id);
      if (user) {
        // Broadcast user offline status
        socket.broadcast.emit("user-status", {
          userId: user.userId,
          status: "offline",
          lastSeen: new Date()
        });
        
        // Remove from active users
        activeUsers.delete(socket.id);
      }
    });

    // Error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  // Periodic cleanup of inactive connections
  setInterval(() => {
    const now = new Date();
    const inactiveThreshold = 30 * 60 * 1000; // 30 minutes

    for (const [socketId, user] of activeUsers.entries()) {
      if (now - user.joinedAt > inactiveThreshold) {
        console.log(`Cleaning up inactive user: ${user.userId}`);
        activeUsers.delete(socketId);
      }
    }
  }, 5 * 60 * 1000); // Check every 5 minutes

  console.log("Socket.io server initialized");
  
  return io;
}