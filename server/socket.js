import { Server } from "socket.io";

let io;

export default function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      path: "/api/socket",
      cors: {
        origin: "*", 
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("join", (userId) => {
        socket.join(userId); 
      });

      socket.on("chat-message", ({ senderId, receiverId, message }) => {
        io.to(receiverId).emit("receive-message", {
          senderId,
          message,
          timestamp: new Date(),
        });
      });
    });
  }
}
