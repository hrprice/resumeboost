import { useGetAllResumesQuery } from "@resume-optimizer/ui/graphql/resume/resume";
import useAxios from "@resume-optimizer/ui/state/use-axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import Text from "@resume-optimizer/ui/components/Text";
import UploadIcon from "@material-symbols/svg-400/rounded/upload_file-fill.svg?react";
import CircularProgressBox from "@resume-optimizer/ui/components/CircularProgressBox";
import { DialogBackdrop, DialogPanel, Dialog } from "@headlessui/react";
import { useResumeUpload } from "@resume-optimizer/ui/hooks/use-resume-upload";
import ResumeUpload from "@resume-optimizer/ui/pages/chat/components/ResumeUpload";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const ResumeUploadModal = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const [resumeFile, setResumeFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);
  const uploadResumeFile = useResumeUpload();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const uploadResume = useCallback(async () => {
    if (!resumeFile || loading) return;
    setLoading(true);
    await uploadResumeFile(resumeFile)
      .then(() => setLoading(false))
      .then(() => navigate(0))
      .catch(() =>
        enqueueSnackbar("Error uploading resume", {
          variant: "error",
          preventDuplicate: true,
        })
      );
  }, [enqueueSnackbar, loading, navigate, resumeFile, uploadResumeFile]);

  return (
    <Dialog open={open} className="relative z-10" onClose={close}>
      <DialogBackdrop className="fixed inset-0 bg-secondary-dark/30 backdrop-blur-lg" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="flex flex-col items-center gap-4  border-2 border-primary-light bg-background rounded-[20px] p-4 w-[650px] min-h-[350px] justify-center">
          {loading ? (
            <CircularProgressBox />
          ) : (
            <ResumeUpload setResumeFile={setResumeFile} />
          )}
          {resumeFile && !loading && (
            <div className="border rounded-lg w-full h-fit border-text-muted bg-gray-200 flex items-center justify-between px-2">
              <Text variant="subtitle2" className="text-text-muted">
                {resumeFile.name}
              </Text>
            </div>
          )}
          {resumeFile && !loading && (
            <button
              className="rounded-full bg-info p-2 px-4 w-fit"
              onClick={uploadResume}
            >
              <Text variant="h6" className="font-medium text-white">
                Finish
              </Text>
            </button>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const ResumePage = () => {
  const [resumeUrl, setResumeUrl] = useState<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const axios = useAxios();

  const { data, loading, error } = useGetAllResumesQuery();
  const resumes = useMemo(() => data?.getAllResumes || [], [data]);

  useEffect(() => {
    if (!resumes || !resumes.length) return;
    const getResumeFile = async () => {
      await axios
        .get(`resume/${resumes[0].resumeId}`, {
          responseType: "blob",
        })
        .then(({ data }) => {
          setResumeUrl(URL.createObjectURL(data));
        });
    };
    getResumeFile();
  }, [axios, resumes]);

  return (
    <>
      <ResumeUploadModal open={modalOpen} close={() => setModalOpen(false)} />
      <div className="w-full h-screen flex items-center bg-surface justify-center">
        <div className="grid grid-rows-[min-content_1fr] grid-cols-1 md:container bg-background gap-5 p-5 h-full w-full">
          {loading ? (
            <CircularProgressBox />
          ) : (
            <>
              <div className="flex gap-4 h-fit">
                <Text variant="h5">{resumes[0].fileName}</Text>
                <button
                  className="rounded-md hover:bg-secondary-default/20 transition-all duration-100"
                  onClick={() => setModalOpen(true)}
                >
                  <UploadIcon className="fill-secondary-default size-10" />
                </button>
              </div>
              <div className="w-full h-full">
                <object
                  className="w-full h-full"
                  type="application/pdf"
                  data={resumeUrl}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default ResumePage;
