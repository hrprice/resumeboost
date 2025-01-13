import { useState, useEffect, useCallback } from "react";
import UploadModal from "@resume-optimizer/ui/pages/chat/components/UploadModal";
import { useSnackbar } from "notistack";
import { ProgressCardStepEnum } from "@resume-optimizer/ui/pages/chat/constants/chat-constants";
import ChatBox from "@resume-optimizer/ui/pages/chat/components/ChatBox";
import ResumeEditor from "@resume-optimizer/ui/pages/chat/components/ResumeEditor";
import {
  ResumeUpdate,
  TextContent,
} from "@resume-optimizer/shared/socket-constants";
import { WebsocketEvents } from "@resume-optimizer/shared/socket-constants";
import { getPDFText } from "@resume-optimizer/ui/utils/pdf-utils";
import { Buffer } from "buffer";
import useAxios from "@resume-optimizer/ui/state/use-axios";
import useSocketIo from "@resume-optimizer/ui/state/use-socket-io";

const ChatPage = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [jobUrl, setJobUrl] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<ProgressCardStepEnum[]>(
    []
  );
  const [error, setError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [resumeTextContent, setResumeTextContent] = useState<TextContent[][]>(
    []
  );
  const axiosClient = useAxios();
  const socket = useSocketIo();

  useEffect(() => {
    if (!socket) return;

    socket.connect();

    const onJobDescriptionProcessingComplete = () =>
      setCompletedSteps((prev) => [
        ...prev,
        ProgressCardStepEnum.ProcessingJobDescription,
      ]);
    const onAnalyzingComplete = () =>
      setCompletedSteps((prev) => [...prev, ProgressCardStepEnum.Analyzing]);
    const onError = (message: string) => {
      console.error(message);
      setError(true);
    };
    const onResumeUpdate = (data: TextContent[][]) =>
      setResumeTextContent(data);
    const onNoActiveConversation = () => {
      setUploadModalOpen(true);
    };

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

    return () => {
      socket.off(
        WebsocketEvents.Chat.NoActiveConversationFound,
        onNoActiveConversation
      );
      socket.off(
        WebsocketEvents.JobDescription.ProcessingComplete,
        onJobDescriptionProcessingComplete
      );
      socket.off(WebsocketEvents.Chat.AnalyzingComplete, onAnalyzingComplete);
      // socket.off(WebsocketEvents.Error.ConnectError, onError);
      socket.off(WebsocketEvents.Error.Error, onError);
      // socket.off(WebsocketEvents.Error.ReconnectError, onError);
      socket.off(WebsocketEvents.Resume.Update, onResumeUpdate);
      socket.disconnect();
    };
  }, [socket]);

  const uploadResume = useCallback(async () => {
    if (!resumeFile) return;
    const resumeText = await getPDFText(resumeFile);
    const payload = new FormData();
    payload.append("file", resumeFile);
    payload.append("textContent", JSON.stringify(resumeText));
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
  }, [axiosClient, enqueueSnackbar, resumeFile]);

  const handleComplete = useCallback(async () => {
    const resumeId = await uploadResume();
    setCompletedSteps((prev) => [
      ...prev,
      ProgressCardStepEnum.UploadingResume,
    ]);
    socket.emit(WebsocketEvents.Chat.StartChat, { jobUrl, resumeId });
  }, [jobUrl, socket, uploadResume]);

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
        <div className="container h-full w-full bg-background border flex justify-between p-5 gap-5">
          <ResumeEditor resumeTextContent={resumeTextContent} />
          <ChatBox socket={socket} />
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
