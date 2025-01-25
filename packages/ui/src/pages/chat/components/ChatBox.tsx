import { ChatMessage } from "@resume-optimizer/shared/socket-constants";
import Text from "@resume-optimizer/ui/components/Text";
import SendIcon from "@material-symbols/svg-400/rounded/arrow_circle_up-fill.svg?react";
import { useCallback, useRef, useState } from "react";
import classNames from "classnames";
import { Fade } from "@mui/material";
import { LoadingDots } from "@resume-optimizer/ui/components/LoadingDots";
import OnboardingPopover from "@resume-optimizer/ui/components/OnboardingPopover";
import { OnboardingStep } from "@resume-optimizer/ui/graphql/graphql";

const MessageBubble = ({ content, messageType }: ChatMessage) => {
  return (
    <Fade in mountOnEnter={false}>
      <div
        className={classNames(
          "max-w-[300px] min-h-9 px-3 py-1 rounded-xl flex items-center w-fit",
          {
            "bg-primary-dark rounded-br-none": messageType === "human",
            "bg-secondary-dark rounded-bl-none": messageType === "ai",
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
  messages: ChatMessage[];
}) => {
  return (
    <div className="flex flex-col gap-2 w-full max-h-full">
      {messages.map((message) => (
        <div
          key={message.content}
          className={classNames({
            "self-left": message.messageType === "ai",
            "self-end": message.messageType === "human",
          })}
        >
          <MessageBubble {...message} />
        </div>
      ))}
      {messageLoading && <MessageBubble content="" messageType="ai" />}
    </div>
  );
};

const ChatBox = ({
  messages,
  messageLoading,
  sendMessage: emitMessage,
}: {
  messages: ChatMessage[];
  messageLoading: boolean;
  sendMessage: (s: string) => void;
}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = useCallback(() => {
    if (!inputRef.current || !currentMessage) return;
    emitMessage(currentMessage);
    setCurrentMessage("");
    inputRef.current.setSelectionRange(0, 0);
    inputRef.current.focus();
  }, [currentMessage, emitMessage]);

  return (
    <div className="w-[35%] border-[4px] border-primary-light h-full flex flex-col rounded-xl justify-end p-2 gap-4 items-center bg-surface">
      <div className="w-full h-full flex overflow-auto">
        <MessagesDisplay messages={messages} messageLoading={messageLoading} />
      </div>
      <OnboardingPopover
        onboardingStep={OnboardingStep.SendMessage}
        nextStep={OnboardingStep.ResumeUpdate}
        wrapperClassName="w-full"
      >
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
      </OnboardingPopover>
    </div>
  );
};

export default ChatBox;
