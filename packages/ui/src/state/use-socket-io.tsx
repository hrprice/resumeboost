import { useContext } from "react";
import SocketIoContext from "./socket-io-context";

const useSocketIo = () => useContext(SocketIoContext);

export default useSocketIo;
