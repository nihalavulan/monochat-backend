import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      socket.data.userId = decoded.userId;

      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {

    const userId = socket.data.userId
    console.log("Socket connected:", userId);

    socket.join(userId);

    socket.on("send_message", ({toUserId , text}) => {
        const message = {
            fromUserId: userId,
            text : text,
            createdAt: new Date().toISOString(),
        }

        io.to(toUserId).emit("receive_message", message);
        io.to(userId).emit("receive_message", message);
    })
  });
}
