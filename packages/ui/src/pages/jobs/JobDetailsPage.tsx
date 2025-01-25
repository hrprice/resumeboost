import { useGetConversationByIdQuery } from "@resume-optimizer/ui/graphql/jobs/jobs";
import { useParams } from "react-router-dom";
import ChatPageHeader from "@resume-optimizer/ui/pages/chat/components/ChatPageHeader";
import ResumeEditor from "@resume-optimizer/ui/pages/chat/components/ResumeEditor";
import { CircularProgress } from "@mui/material";

const JobDetailsPage = () => {
  const { conversationId } = useParams();

  const { data, loading } = useGetConversationByIdQuery({
    variables: { id: conversationId! },
  });
  const { jobDescription = null, updatedResumeText = null } =
    data?.getConversationById || {};

  return (
    <div className="flex h-screen justify-center bg-surface">
      {loading ? (
        <div className="flex w-full h-full justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-rows-[min-content_1fr] grid-cols-1 md:container bg-background gap-5 p-5">
          {jobDescription && <ChatPageHeader {...jobDescription} />}
          <div className="flex w-full h-full justify-center overflow-hidden">
            {updatedResumeText && (
              <ResumeEditor
                className="w-8/10"
                resumeTextContent={updatedResumeText}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default JobDetailsPage;
