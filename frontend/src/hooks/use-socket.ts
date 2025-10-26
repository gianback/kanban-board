import type { Card } from "@/interfaces/card";
import { useRef } from "react";
import { Manager, Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const connectToServer = () => {
    if (socketRef.current) return;

    const manager = new Manager("http://localhost:3000/socket.io/socket.io.js");

    manager?.removeAllListeners();
    socketRef.current = manager.socket("/");

    addListeners(socketRef.current);
  };

  const addListeners = (socket: Socket) => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  };

  const emitCreatedCard = (card: {
    title: string;
    description?: string;
    autor: string;
    priority: string;
  }) => {
    if (!socketRef.current) return console.warn("Socket no conectado");
    socketRef.current.emit("created-card", card);
  };

  const emitUpdatedCard = (card: Card) => {
    if (!socketRef.current) return console.warn("Socket no conectado");
    socketRef.current.emit("updated-card", card);
  };

  const onCreatedCard = (callback: (card: Card) => void) => {
    socketRef.current?.on("on-created-card", callback);
  };

  const onUpdatedCard = (callback: (card: Card) => void) => {
    socketRef.current?.on("on-updated-card", callback);
  };

  return {
    connectToServer,
    emitCreatedCard,
    emitUpdatedCard,
    onUpdatedCard,
    onCreatedCard,
  };
};
