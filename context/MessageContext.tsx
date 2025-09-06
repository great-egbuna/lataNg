// context/MessageContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { getValueFor } from "@/store/storage";
import { useAuth } from "./AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

export interface MessageContextProps {
  messages: any[];
  loading: boolean;
  error: { isError: boolean; errorMessage: string } | null;
  socket: Socket | null;
}

const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    isError: boolean;
    errorMessage: string;
  } | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const { user } = useAuth() as IAUTH;
  const SOCKET_URL = "https://lata-chat.azurewebsites.net";

  useEffect(() => {
    let socketInstance: Socket;

    (async () => {
      const token = await getValueFor("lataAuthToken");
      try {
        socketInstance = io(SOCKET_URL, {
          transports: ["websocket"],
          autoConnect: true,
          auth: {
            token: token,
          },
        });

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
          socketInstance.emit(`get-all:chats${user?.id}`);
        });

        socketInstance.on(`receive-all:chats${user?.id}`, (res) => {
          setMessages(res);
          setLoading(false);
        });

        socketInstance.on("connect_error", () =>
          setError({ isError: true, errorMessage: "Socket connection error" })
        );

        socketInstance.on("connect_timeout", () =>
          setError({
            isError: true,
            errorMessage: "Socket connection timeout error",
          })
        );
      } catch (error) {
        setError({ isError: true, errorMessage: "Socket server error" });
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      socketInstance?.disconnect();
    };
  }, [user?.id]);

  const value = {
    messages,
    loading,
    error,
    socket,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  return context;
}
