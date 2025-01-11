import { useState, useEffect } from "react";
import UploadModal from "@resume-optimizer/ui/pages/chat/components/UploadModal";
import { useSnackbar } from "notistack";
import { ProgressCardStepEnum } from "@resume-optimizer/ui/pages/chat/constants/chat-constants";
import { io, Socket } from "socket.io-client";
import ChatBox from "@resume-optimizer/ui/pages/chat/components/ChatBox";
import ResumeEditor, {
  ResumeUpdate,
} from "@resume-optimizer/ui/pages/chat/components/ResumeEditor";
import { WebsocketEvents } from "@resume-optimizer/shared/socket-constants";
import { getPDFText } from "@resume-optimizer/ui/utils/pdf-utils";
import { Buffer } from "buffer";
import useAxios from "@resume-optimizer/ui/state/use-axios";

const ChatPage = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(true);
  const [jobUrl, setJobUrl] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<ProgressCardStepEnum[]>(
    []
  );
  const [resumeUpdates, setResumeUpdates] = useState<ResumeUpdate[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const [error, setError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [resumeText, setResumeText] = useState<string[]>();
  const axiosClient = useAxios();

  useEffect(() => {
    if (!resumeFile) return;
    const getResumeBuffer = async () => {
      const resumeBuffer = await resumeFile.arrayBuffer();
      const PDFText = await getPDFText(Buffer.from(resumeBuffer)).then((text) =>
        text.map((content) => content.replace(/●/g, "•"))
      );
      setResumeText(PDFText);
    };
    getResumeBuffer();
  }, [resumeFile]);

  useEffect(() => {
    if (!socket) return;

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
    const onResumeUpdate = (data: ResumeUpdate) => {
      setResumeUpdates((prev) => [...prev, data]);
    };

    socket.on(
      WebsocketEvents.JobDescription.ProcessingComplete,
      onJobDescriptionProcessingComplete
    );
    socket.on(WebsocketEvents.Chat.AnalyzingComplete, onAnalyzingComplete);
    socket.on(WebsocketEvents.Resume.Update, onResumeUpdate);

    socket.on(WebsocketEvents.Error.ConnectError, onError);
    socket.on(WebsocketEvents.Error.Error, onError);
    socket.on(WebsocketEvents.Error.ReconnectError, onError);

    return () => {
      socket.off(
        WebsocketEvents.JobDescription.ProcessingComplete,
        onJobDescriptionProcessingComplete
      );
      socket.off(WebsocketEvents.Chat.AnalyzingComplete, onAnalyzingComplete);
      socket.off(WebsocketEvents.Error.ConnectError, onError);
      socket.off(WebsocketEvents.Error.Error, onError);
      socket.off(WebsocketEvents.Error.ReconnectError, onError);
      socket.off(WebsocketEvents.Resume.Update, onResumeUpdate);
      socket.close();
    };
  }, [socket]);

  const uploadResume = async () => {
    if (!resumeFile || !resumeText) return;
    const payload = new FormData();
    payload.append("file", resumeFile);
    payload.append("textContent", resumeText.join("\n"));
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
    if (!resumeId || !jobUrl) return;
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
    // connectToSocket(resumeId);
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
        <div className="container h-full w-full bg-background border flex justify-between p-5 gap-5">
          <ResumeEditor resumeUpdates={resumeUpdates} resumeText={resumeText} />
          <ChatBox socket={socket} />
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
