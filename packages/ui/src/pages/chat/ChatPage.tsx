import { useState, useEffect } from "react";
import UploadModal from "./components/UploadModal.tsx";
import { useSnackbar } from "notistack";
import axiosClient from "../../../axios-client.ts";
import { ProgressCardStepEnum } from "./constants/chat-constants.ts";
import { io, Socket } from "socket.io-client";
import ChatBox from "./components/ChatBox.tsx";
import ResumeEditor from "./components/ResumeEditor.tsx";

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

    socket.on("resume.processingComplete", onResumeProcessingComplete);
    socket.on(
      "jobDescription.processingComplete",
      onJobDescriptionProcessingComplete
    );
    socket.on("analyzingComplete", onAnalyzingComplete);
    socket.on("chat.chatBotMessage", (data) => console.log(data));

    socket.on("connect_error", (error) => {
      setError(true);
      console.error("Connection error:", error.message);
    });
    socket.on("error", (error) => {
      setError(true);
      console.error("Socket error:", error);
    });
    socket.on("reconnect_error", (error) => {
      setError(true);
      console.error("Reconnection error:", error.message);
    });
    socket.onAny((event, ...args) => {
      console.log(`Received event: ${event}`, args);
    });
    return () => {
      socket.off("resume.processingComplete", onResumeProcessingComplete);
      socket.off(
        "jobDescription.processingComplete",
        onJobDescriptionProcessingComplete
      );
      socket.off("analyzingComplete", onAnalyzingComplete);
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
