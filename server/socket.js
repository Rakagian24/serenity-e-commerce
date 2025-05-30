import { Server } from "socket.io";

let io;

export default function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      path: "/api/socket",
      cors: {
        origin: "*", // sebaiknya ubah ke origin app kamu
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("join", (userId) => {
        socket.join(userId); // setiap user bergabung ke room unik-nya
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
