import { io } from "socket.io-client";

const socketIoClient = io(import.meta.env.VITE_BACKEND_URI, {
  autoConnect: false,
});

export default socketIoClient;
