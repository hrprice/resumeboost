import { Socket } from "socket.io-client";

const ChatBox = ({ socket }: { socket: Socket }) => {
  return (
    <div className="w-[35%] bg-primary-light h-full flex rounded-xl justify-center items-center">
      chat placeholder
    </div>
  );
};

export default ChatBox;
