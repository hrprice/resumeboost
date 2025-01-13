import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@resume-optimizer/shared/socket-constants";
import { createContext } from "react";
import { Socket, io } from "socket.io-client";

const SocketIoContext = createContext<
  Socket<ServerToClientEvents, ClientToServerEvents>
>(
  io(import.meta.env.VITE_BACKEND_URI, {
    autoConnect: false,
  })
);

export default SocketIoContext;
