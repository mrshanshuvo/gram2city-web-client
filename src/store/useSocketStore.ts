import { create } from "zustand";
import { io } from "socket.io-client";

import { SocketState } from "@/types";

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connected: false,

  initializeSocket: () => {
    // Prevent multiple initializations
    if (get().socket) return;

    const socketInstance = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        transports: ["websocket"],
        reconnectionAttempts: 5,
      },
    );

    socketInstance.on("connect", () => {
      console.log("⚡ Connected to Gram2City Real-time Engine (Zustand)");
      set({ connected: true });
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from Real-time Engine");
      set({ connected: false });
    });

    set({ socket: socketInstance });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, connected: false });
    }
  },
}));
