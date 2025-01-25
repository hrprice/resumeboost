import { useState, useEffect, useCallback } from "react";
import StartChatModal from "@resume-optimizer/ui/pages/chat/components/StartChatModal";
import { ProgressCardStepEnum } from "@resume-optimizer/ui/pages/chat/constants/chat-constants";
import ChatBox from "@resume-optimizer/ui/pages/chat/components/ChatBox";
import ResumeEditor from "@resume-optimizer/ui/pages/chat/components/ResumeEditor";
import {
  ChatMessage,
  iJobDescription,
  TextContent,
} from "@resume-optimizer/shared/socket-constants";
import { WebsocketEvents } from "@resume-optimizer/shared/socket-constants";
import useSocketIo from "@resume-optimizer/ui/state/use-socket-io";
import ChatPageHeader from "./components/ChatPageHeader";
import { useNavigate } from "react-router-dom";
import CircularProgressBox from "@resume-optimizer/ui/components/CircularProgressBox";
import { useResumeUpload } from "@resume-optimizer/ui/hooks/use-resume-upload";
import { useErrorBoundary } from "react-error-boundary";
import { useOnboardingContext } from "@resume-optimizer/ui/state/onboarding-context";
import { OnboardingStep } from "@resume-optimizer/ui/graphql/graphql";

const ChatPage = () => {
  const [resumeFile, setResumeFile] = useState<File | string>("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [jobUrl, setJobUrl] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<ProgressCardStepEnum[]>(
    []
  );
  const [resumeTextContent, setResumeTextContent] = useState<TextContent[][]>(
    []
  );
  const [jobDescription, setJobDescription] = useState<iJobDescription>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const socket = useSocketIo();
  const navigate = useNavigate();
  const uploadResumeFile = useResumeUpload();
  const { showBoundary } = useErrorBoundary();
  const { setPopoverStates } = useOnboardingContext();
  const loading = !jobDescription || !resumeTextContent.length || !socket;

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    const onJobDescriptionProcessingComplete = (data: iJobDescription) => {
      setJobDescription(data);
      setCompletedSteps((prev) => [
        ...prev,
        ProgressCardStepEnum.ProcessingJobDescription,
      ]);
    };
    const onAnalyzingComplete = () =>
      setCompletedSteps((prev) => [...prev, ProgressCardStepEnum.Analyzing]);
    const onError = (message: string) => {
      console.error(message);
      showBoundary(message);
    };
    const onResumeUpdate = (data: TextContent[][]) => {
      setResumeTextContent(data);
      setMessageLoading(false);
      if (data.some((page) => page.length > 1))
        setPopoverStates((prev) => ({
          ...prev,
          [OnboardingStep.ResumeUpdate]: true,
        }));
    };
    const onNoActiveConversation = () => {
      setUploadModalOpen(true);
    };
    const onMessageHistory = (messageHistory: ChatMessage[]) => {
      setMessages(messageHistory);
    };
    const onChatBotMessage = (newMessage: ChatMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      setMessageLoading(false);
    };
    const onConversationDeactivated = () => {
      navigate(`/jobs`);
    };

    socket.on(WebsocketEvents.Chat.MessageHistory, onMessageHistory);
    socket.on(WebsocketEvents.Chat.ChatBotMessage, onChatBotMessage);
    socket.on(WebsocketEvents.Resume.Update, onResumeUpdate);
    socket.on(
      WebsocketEvents.Chat.NoActiveConversationFound,
      onNoActiveConversation
    );
    socket.on(
      WebsocketEvents.JobDescription.ProcessingComplete,
      onJobDescriptionProcessingComplete
    );
    socket.on(WebsocketEvents.Chat.AnalyzingComplete, onAnalyzingComplete);
    socket.on(WebsocketEvents.Resume.Update, onResumeUpdate);
    socket.on(WebsocketEvents.Error.Error, onError);
    socket.on(
      WebsocketEvents.Chat.ConversationDeactivated,
      onConversationDeactivated
    );

    return () => {
      socket.off(WebsocketEvents.Chat.MessageHistory, onMessageHistory);
      socket.off(WebsocketEvents.Chat.ChatBotMessage, onChatBotMessage);
      socket.off(WebsocketEvents.Resume.Update, onResumeUpdate);
      socket.off(
        WebsocketEvents.Chat.NoActiveConversationFound,
        onNoActiveConversation
      );
      socket.off(
        WebsocketEvents.JobDescription.ProcessingComplete,
        onJobDescriptionProcessingComplete
      );
      socket.off(WebsocketEvents.Chat.AnalyzingComplete, onAnalyzingComplete);
      socket.off(WebsocketEvents.Error.Error, onError);
      socket.off(WebsocketEvents.Resume.Update, onResumeUpdate);
      socket.off(
        WebsocketEvents.Chat.ConversationDeactivated,
        onConversationDeactivated
      );
      socket.disconnect();
    };
  }, [navigate, setPopoverStates, showBoundary, socket]);

  const sendMessage = useCallback(
    (messageContent: string) => {
      if (messageLoading) return;
      setMessageLoading(true);
      socket?.emit(WebsocketEvents.Chat.UserMessage, {
        content: messageContent,
        messageType: "human",
      });
      setMessages((prev) => [
        ...prev,
        { content: messageContent, messageType: "human" },
      ]);
    },
    [messageLoading, socket]
  );

  const uploadResume = useCallback(async () => {
    if (!resumeFile || typeof resumeFile === "string") return;
    return uploadResumeFile(resumeFile);
  }, [resumeFile, uploadResumeFile]);

  const startChat = useCallback(async () => {
    const resumeId =
      typeof resumeFile === "string" ? resumeFile : await uploadResume();
    setCompletedSteps((prev) => [
      ...prev,
      ProgressCardStepEnum.UploadingResume,
    ]);
    if (!resumeId) return;
    socket.emit(WebsocketEvents.Chat.StartChat, { jobUrl, resumeId });
  }, [jobUrl, resumeFile, socket, uploadResume]);

  const endChat = useCallback(() => {
    socket.emit(WebsocketEvents.Chat.Close);
  }, [socket]);

  return (
    <div className="z-0">
      <StartChatModal
        open={uploadModalOpen}
        resumeFile={resumeFile}
        setResumeFile={setResumeFile}
        jobUrl={jobUrl}
        setJobUrl={setJobUrl}
        completedSteps={completedSteps}
        onSubmit={startChat}
        error={false}
        close={() => setUploadModalOpen(false)}
      />
      <div className="flex bg-surface justify-center h-screen">
        {loading ? (
          <CircularProgressBox />
        ) : (
          <div className="grid grid-rows-[min-content_1fr] grid-cols-1 lg:container bg-background gap-5 p-5">
            <ChatPageHeader {...jobDescription} />
            <div className="flex justify-between gap-5 h-full overflow-hidden">
              <ResumeEditor
                resumeTextContent={resumeTextContent}
                onComplete={endChat}
              />
              <ChatBox
                messages={messages}
                messageLoading={messageLoading}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatPage;
