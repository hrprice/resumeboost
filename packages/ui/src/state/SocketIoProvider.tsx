import { ReactNode, useEffect, useState, useMemo } from "react";
import SocketIoContext from "./socket-io-context";
import { useAuthContext } from "./use-auth-context";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@resume-optimizer/shared/socket-constants";

const SocketIoProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [token, setToken] = useState<string>();

  const socketIoClient: Socket<ServerToClientEvents, ClientToServerEvents> =
    useMemo(() => {
      return io(import.meta.env.VITE_BACKEND_URI, {
        autoConnect: false,
        extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
        reconnection: false,
      });
    }, [token]);

  useEffect(() => {
    if (!user) {
      setToken(undefined);
      return;
    }

    const getAuthToken = async () => {
      try {
        const tkn = await user.getIdToken();
        setToken(tkn);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    getAuthToken();
  }, [user]);

  return (
    <SocketIoContext.Provider value={socketIoClient}>
      {children}
    </SocketIoContext.Provider>
  );
};

export default SocketIoProvider;
