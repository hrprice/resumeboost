import { Socket } from "socket.io-client";
import { WebsocketEvents } from "@resume-optimizer/shared/socket-constants";
import Text from "@resume-optimizer/ui/components/Text";
import SendIcon from "@material-symbols/svg-400/rounded/arrow_circle_up-fill.svg?react";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Fade, Slide } from "@mui/material";

type MessageType = "user" | "chatbot";

interface Message {
  content: string | undefined;
  messageType: MessageType;
}

const LoadingDots = () => {
  return (
    <div className="flex gap-1 py-2 pt-3 items-center w-10 justify-center">
      <div
        className="rounded-full bg-text-muted animate-bounce size-2"
        style={{ animationDuration: "1s" }}
      />
      <div
        className="rounded-full bg-text-muted animate-bounce size-2"
        style={{ animationDelay: "0.2s", animationDuration: "1s" }}
      />
      <div
        className="rounded-full bg-text-muted animate-bounce size-2"
        style={{ animationDelay: "0.4s", animationDuration: "1s" }}
      />
    </div>
  );
};

const MessageBubble = ({ content, messageType }: Message) => {
  return (
    <Fade in mountOnEnter={false}>
      <div
        className={classNames(
          "max-w-[300px] min-h-9 px-3 py-1 rounded-xl flex items-center w-fit",
          {
            "bg-primary-dark rounded-br-none": messageType === "user",
            "bg-secondary-dark rounded-bl-none": messageType === "chatbot",
          }
        )}
      >
        {content ? (
          <Text variant="body1" className="text-white leading-snug">
            {content}
          </Text>
        ) : (
          <LoadingDots />
        )}
      </div>
    </Fade>
  );
};

const MessagesDisplay = ({
  messageLoading,
  messages,
}: {
  messageLoading?: boolean;
  messages: Message[];
}) => {
  return (
    <div className="flex flex-col gap-2 w-full max-h-full">
      {messages.map((message) => (
        <div
          className={classNames({
            "self-left": message.messageType === "chatbot",
            "self-end": message.messageType === "user",
          })}
        >
          <MessageBubble {...message} />
        </div>
      ))}
      {messageLoading && (
        <MessageBubble content={undefined} messageType="chatbot" />
      )}
    </div>
  );
};

const ChatBox = ({ socket }: { socket: Socket | undefined }) => {
  const [messageLoading, setMessageLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello, how can I assist you?",
      messageType: "chatbot",
    },
  ]);

  useEffect(() => {
    if (!socket) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onChatBotMessage = (data: any) => {
      console.log(data);
    };
    socket.on(WebsocketEvents.Chat.ChatBotMessage, onChatBotMessage);

    return () => {
      socket.off(WebsocketEvents.Chat.ChatBotMessage, onChatBotMessage);
    };
  }, [socket]);

  const mockMessage = async () => {
    const message = currentMessage;
    setMessages((prev) => [
      ...prev,
      { content: currentMessage, messageType: "user" },
    ]);
    setCurrentMessage("");
    setMessageLoading(true);
    await (() => new Promise((resolve) => window.setTimeout(resolve, 3000)))();
    setMessages((prev) => [
      ...prev,
      { content: message, messageType: "chatbot" },
    ]);
    setMessageLoading(false);
  };

  const sendMessage = () => {
    if (messageLoading || !inputRef.current || currentMessage === "") return;
    inputRef.current.setSelectionRange(0, 0);
    inputRef.current.focus();
    mockMessage();
    // socket?.send(WebsocketEvents.Chat.UserMessage, { text: currentMessage });
  };

  return (
    <div className="w-[35%] border-[4px] border-primary-light h-full flex flex-col rounded-xl justify-end p-2 gap-4 items-center bg-surface">
      <div className="w-full min-h-0 max-h-full flex overflow-auto">
        <MessagesDisplay messages={messages} messageLoading={messageLoading} />
      </div>
      <div className="h-20 border-[3px] rounded-xl flex gap-2 px-2 py-1 border-secondary-dark w-full items-center bg-background">
        <textarea
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="resize-none w-full h-full text-xl focus:outline-none bg-background"
          placeholder="Message agent"
        />
        <button
          onClick={sendMessage}
          disabled={messageLoading || currentMessage === ""}
        >
          <SendIcon
            className={classNames({
              "fill-text-muted": messageLoading || currentMessage === "",
              "fill-accent": !(messageLoading || currentMessage === ""),
            })}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
