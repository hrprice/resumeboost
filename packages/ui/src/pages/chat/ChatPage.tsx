import { useState, useEffect } from "react";
import UploadModal from "@resume-optimizer/ui/pages/chat/components/UploadModal";
import { useSnackbar } from "notistack";
import axiosClient from "@resume-optimizer/ui/axios-client.ts";
import { ProgressCardStepEnum } from "@resume-optimizer/ui/pages/chat/constants/chat-constants.ts";
import { io, Socket } from "socket.io-client";
import ChatBox from "@resume-optimizer/ui/pages/chat/components/ChatBox.tsx";
import ResumeEditor from "@resume-optimizer/ui/pages/chat/components/ResumeEditor.tsx";
import { WebsocketEvents } from "@resume-optimizer/shared/socket-constants.ts";

const ChatPage = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [jobUrl, setJobUrl] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<ProgressCardStepEnum[]>(
    []
  );
  const [socket, setSocket] = useState<Socket>();
  const [error, setError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!socket) return;

    const onResumeProcessingComplete = () =>
      setCompletedSteps((prev) => [
        ...prev,
        ProgressCardStepEnum.ProcessingResume,
      ]);
    const onJobDescriptionProcessingComplete = () =>
      setCompletedSteps((prev) => [
        ...prev,
        ProgressCardStepEnum.ProcessingJobDescription,
      ]);
    const onAnalyzingComplete = () =>
      setCompletedSteps((prev) => [...prev, ProgressCardStepEnum.Analyzing]);
    const onError = () => {
      setError(true);
    };

    socket.on(
      WebsocketEvents.Resume.ProcessingComplete,
      onResumeProcessingComplete
    );
    socket.on(
      WebsocketEvents.JobDescription.ProcessingComplete,
      onJobDescriptionProcessingComplete
    );
    socket.on(WebsocketEvents.Chat.AnalyzingComplete, onAnalyzingComplete);
    socket.on(WebsocketEvents.Error.ConnectError, onError);
    socket.on(WebsocketEvents.Error.Error, onError);
    socket.on(WebsocketEvents.Error.ReconnectError, onError);

    return () => {
      socket.off(
        WebsocketEvents.Resume.ProcessingComplete,
        onResumeProcessingComplete
      );
      socket.off(
        WebsocketEvents.JobDescription.ProcessingComplete,
        onJobDescriptionProcessingComplete
      );
      socket.off(WebsocketEvents.Chat.AnalyzingComplete, onAnalyzingComplete);
      socket.off(WebsocketEvents.Chat.AnalyzingComplete, onAnalyzingComplete);
      socket.off(WebsocketEvents.Chat.ChatBotMessage, onChatBotMessage);
      socket.off(WebsocketEvents.Error.ConnectError, onError);
      socket.off(WebsocketEvents.Error.Error, onError);
      socket.off(WebsocketEvents.Error.ReconnectError, onError);
      socket.close();
    };
  }, [socket]);

  const uploadResume = async () => {
    if (!resumeFile) return;
    const payload = new FormData();
    payload.append("file", resumeFile);
    return axiosClient
      .post("resume/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(({ data }) => data)
      .catch(() =>
        enqueueSnackbar("Error uploading resume", {
          variant: "error",
          autoHideDuration: 3000,
          preventDuplicate: true,
        })
      );
  };

  const connectToSocket = (resumeId: string | undefined) => {
    console.log(resumeId, jobUrl);
    if (!resumeId || !jobUrl) return;
    console.log("connecting");
    setSocket(
      io(import.meta.env.VITE_BACKEND_URI, {
        query: {
          resumeId,
          jobUrl,
        },
        reconnection: false,
      })
    );
  };

  const handleComplete = async () => {
    const resumeId = await uploadResume();
    setCompletedSteps((prev) => [
      ...prev,
      ProgressCardStepEnum.UploadingResume,
    ]);
    connectToSocket(resumeId);
  };

  return (
    <div className="relative h-full w-full">
      <UploadModal
        open={uploadModalOpen}
        resumeFile={resumeFile}
        setResumeFile={setResumeFile}
        jobUrl={jobUrl}
        setJobUrl={setJobUrl}
        completedSteps={completedSteps}
        onSubmit={handleComplete}
        error={error}
        close={() => setUploadModalOpen(false)}
      />
      <div className="h-full w-full flex bg-surface justify-center">
        <div className="container bg-background border flex justify-between p-5 gap-5">
          <ResumeEditor />
          <ChatBox socket={socket} />
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
