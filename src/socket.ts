// socket.ts
import { io, Socket } from "socket.io-client";

export interface NotificationType {
  _id: string;
  recipient: string;
  sender?: string;
  message: string;
  postId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServerToClientEvents {
  new_notification: (notification: NotificationType) => void;
  new_bid: (postId: string, bidId:string,message:string) => void;
  bid_updated: (postId: string, bidCount:string) => void;
}

interface ClientToServerEvents {
  register: (userId: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_SOCKET_URL as string,
  {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false, 
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  }
);

export const connectSocket = (userId: string) => {
  if (!socket.connected || socket.disconnected) {
    socket.auth = { userId };
    socket.connect();
  }
};


socket.on("connect", () => {
  console.log("Connected to socket server with ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from socket server:", reason);
});

export default socket;