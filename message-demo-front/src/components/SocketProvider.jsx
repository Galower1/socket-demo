import { createContext, useEffect, useRef } from "react";
import { socket } from "../lib/socket-io";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const listeners = useRef({});

  useEffect(() => {
    socket.onAny((event, data) => {
      if (listeners.current[event]) {
        listeners.current[event](data);
      }
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return <SocketContext.Provider value={{ socket, listeners }}>{children}</SocketContext.Provider>;
}
