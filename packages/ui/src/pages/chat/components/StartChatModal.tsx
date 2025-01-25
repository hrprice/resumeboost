import { DialogPanel, Dialog, DialogBackdrop } from "@headlessui/react";
import Text from "@resume-optimizer/ui/components/Text";
import { useEffect, useMemo } from "react";
import CheckIcon from "@material-symbols/svg-400/rounded/check_circle-fill.svg?react";
import CancelIcon from "@material-symbols/svg-400/rounded/cancel-fill.svg?react";
import { CircularProgress, Collapse, MenuItem, Select } from "@mui/material";
import { twMerge } from "tailwind-merge";
import { ProgressCardStepEnum } from "@resume-optimizer/ui/pages/chat/constants/chat-constants";
import OnboardingCarousel from "@resume-optimizer/ui/pages/chat/components/OnboardingCarousel";
import { useGetAllResumesQuery } from "@resume-optimizer/ui/graphql/resume/resume";
import CircularProgressBox from "@resume-optimizer/ui/components/CircularProgressBox";
import ResumeUpload from "@resume-optimizer/ui/pages/chat/components/ResumeUpload";

export interface ProgressCardProps {
  loading: boolean;
  title: string;
  className?: string;
  error: boolean;
}

const PROGRESS_CARD_STEPS = [
  ProgressCardStepEnum.UploadingResume,
  ProgressCardStepEnum.ProcessingJobDescription,
  ProgressCardStepEnum.Analyzing,
];

const LoadingCompleteErrorIcon = ({
  loading,
  error,
}: {
  loading: boolean;
  error: boolean;
}) => {
  if (error) return <CancelIcon className="fill-error" />;
  return loading ? (
    <CircularProgress
      sx={{
        "& .MuiCircularProgress-circle": {
          stroke: "hsl(var(--tw-color-info))",
        },
      }}
    />
  ) : (
    <CheckIcon className="fill-info" />
  );
};

const ProgressCard = ({
  loading,
  title,
  className,
  error,
}: ProgressCardProps) => {
  return (
    <div
      className={twMerge(
        "flex w-[400px] h-15 rounded-xl border-secondary-default justify-between items-center border-[3px] p-2",
        className
      )}
    >
      <LoadingCompleteErrorIcon loading={loading} error={error} />
      <Text variant="subtitle1" className="font-medium text-secondary-dark">
        {title}
      </Text>
    </div>
  );
};

const ProgressCards = ({
  completedSteps,
  error,
}: {
  completedSteps: ProgressCardStepEnum[];
  error: boolean;
}) => {
  const currentStep = useMemo(() => {
    const lastStep = completedSteps.at(-1);
    if (!lastStep) return ProgressCardStepEnum.UploadingResume;
    const lastStepIndex = PROGRESS_CARD_STEPS.indexOf(lastStep);
    if (lastStepIndex + 1 === PROGRESS_CARD_STEPS.length) return;
    return PROGRESS_CARD_STEPS[lastStepIndex + 1];
  }, [completedSteps]);

  return (
    <div className="flex-col gap-4 flex">
      {PROGRESS_CARD_STEPS.map((title) => (
        <Collapse
          mountOnEnter={false}
          in={!(title !== currentStep && !completedSteps.includes(title))}
          key={title}
        >
          <div>
            <ProgressCard
              title={title}
              loading={title === currentStep}
              error={title === currentStep && error}
            />
          </div>
        </Collapse>
      ))}
    </div>
  );
};

const StartChatModal = ({
  open,
  resumeFile,
  setResumeFile,
  jobUrl,
  setJobUrl,
  completedSteps,
  onSubmit,
  error,
  close,
}: {
  open: boolean;
  resumeFile: File | string;
  setResumeFile: (f: File | string) => void;
  jobUrl: string;
  setJobUrl: (s: string) => void;
  completedSteps: ProgressCardStepEnum[];
  onSubmit: () => void;
  close: () => void;
  error: boolean;
}) => {
  const { data, loading } = useGetAllResumesQuery();
  const userResumes = useMemo(() => data?.getAllResumes || [], [data]);

  const resumeName = useMemo(
    () => (typeof resumeFile === "string" ? resumeFile : resumeFile?.name),
    [resumeFile]
  );
  const urlValid = useMemo(
    () =>
      /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
        jobUrl
      ),
    [jobUrl]
  );

  useEffect(() => {
    if (!userResumes.length) return;
    setResumeFile(userResumes[0].resumeId);
  }, [setResumeFile, userResumes]);

  const carouselPages = [
    {
      content: (
        <div className="w-full h-full flex items-start justify-center flex-col gap-4">
          {!!userResumes.length && (
            <div className="flex-col gap-3 flex">
              <Text variant="h6" className="text-secondary-default">
                Select a resume
              </Text>
              <Select
                onChange={(e) => setResumeFile(e.target.value)}
                value={resumeFile}
              >
                {userResumes.map(({ fileName, resumeId }) => (
                  <MenuItem
                    className="border rounded-lg w-full h-fit border-text-muted bg-gray-200 flex items-center justify-between px-2"
                    key={fileName}
                    value={resumeId}
                  >
                    {fileName}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
          <div className="flex-col gap-3 flex">
            <Text variant="h6" className="text-secondary-default">
              {userResumes.length
                ? "Or upload a new one"
                : "Upload your resume"}
            </Text>
            <ResumeUpload setResumeFile={setResumeFile} />
            {resumeFile && typeof resumeFile !== "string" && (
              <div className="border rounded-lg w-full h-fit border-text-muted bg-gray-200 flex items-center justify-between px-2">
                <Text variant="subtitle2" className="text-text-muted">
                  {resumeName}
                </Text>
              </div>
            )}
          </div>
        </div>
      ),
      stepComplete: !!resumeFile,
    },
    {
      content: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex-col gap-3 flex">
            <Text variant="h6" className="text-secondary-default">
              Paste a link to the job description
            </Text>
            <input
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://linkedin.com/jobs/..."
              className="h-10 w-[500px] border border-secondary-dark px-3 rounded-lg"
            />
          </div>
        </div>
      ),
      stepComplete: urlValid,
      onComplete: onSubmit,
    },
    {
      content: (
        <div className="h-full w-full flex items-center flex-col gap-8 pt-[120px]">
          <ProgressCards completedSteps={completedSteps} error={error} />
          {completedSteps.length === PROGRESS_CARD_STEPS.length && (
            <button className="rounded-full bg-info p-2 px-4" onClick={close}>
              <Text variant="h6" className="font-medium text-white">
                Finish
              </Text>
            </button>
          )}
        </div>
      ),
      stepComplete: false,
      // TODO add logic to interrupt the process if the user goes back
    },
  ];

  return (
    <Dialog open={open} className="relative z-10" onClose={() => {}}>
      <DialogBackdrop className="fixed inset-0 bg-secondary-dark/30 backdrop-blur-lg" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="relative w-[750px] h-[625px] border-2 border-primary-light bg-background rounded-[20px] p-2">
          <Text
            variant="h5"
            className="text-white rounded-full w-fit px-4 py-2 font-bold bg-primary-light absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2"
          >
            Get Started
          </Text>
          {loading ? (
            <CircularProgressBox />
          ) : (
            <OnboardingCarousel pages={carouselPages} />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
export default StartChatModal;
