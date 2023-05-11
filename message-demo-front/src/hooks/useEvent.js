import { useContext, useEffect } from "react";
import { SocketContext } from "../components/SocketProvider";

export function useEvent(name, callback) {
  const { listeners } = useContext(SocketContext);

  useEffect(() => {
    listeners.current[name] = callback;
  }, []);
}
