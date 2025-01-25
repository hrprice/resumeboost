import { ReactNode, useCallback, useMemo } from "react";
import Text from "@resume-optimizer/ui/components/Text";
import { OnboardingStep } from "@resume-optimizer/ui/graphql/graphql";
import { twMerge } from "tailwind-merge";
import { useOnboardingContext } from "@resume-optimizer/ui/state/onboarding-context";
import CloseIcon from "@material-symbols/svg-400/rounded/close-fill.svg?react";

const onboardingPopoverContent: Record<
  OnboardingStep,
  ({ close }: { close?: () => void }) => ReactNode | null
> = {
  [OnboardingStep.StartChat]: ({ close }: { close?: () => void }) => (
    <div className="w-[300px] rounded-lg border border-primary-default bg-background absolute -bottom-10 left-1/2 -translate-x-1/2 transform translate-y-[100%] pointer-events-none">
      <div className="w-full h-full relative flex flex-col gap-2 p-5 items-center">
        <button
          onClick={close}
          className="absolute top-1 right-1 rounded-full hover:bg-surface transition-all pointer-events-auto"
        >
          <CloseIcon className="size-5  fill-text-muted" />
        </button>
        <Text variant="h6" className="sef-center">
          Welcome to <span className="text-primary-default">JobJunkie</span>!
        </Text>
        <Text variant="body1">
          Get started optimizing your resume by starting a chat.
        </Text>
      </div>
    </div>
  ),
  [OnboardingStep.SendMessage]: ({ close }: { close?: () => void }) => (
    <div className="w-[400px] rounded-lg border border-primary-default bg-background absolute -top-10 left-1/2 -translate-x-1/2 transform -translate-y-[100%] pointer-events-none">
      <div className="w-full h-full relative flex gap-2 p-5 items-start">
        <button
          onClick={close}
          className="absolute top-1 right-1 rounded-full hover:bg-surface transition-all pointer-events-auto"
        >
          <CloseIcon className="size-5 fill-text-muted" />
        </button>
        <Text variant="body1">
          Now you can chat with your personalized AI assistant and it will
          automatically update your resume!
        </Text>
      </div>
    </div>
  ),
  [OnboardingStep.ResumeUpdate]: ({ close }: { close?: () => void }) => (
    <div className="w-[300px] rounded-lg border border-primary-default bg-background absolute -bottom-10 right-0 transform translate-y-[100%] pointer-events-none">
      <div className="w-full h-full relative flex flex-col gap-2 p-5 items-center">
        <button
          onClick={close}
          className="absolute top-1 right-1 rounded-full hover:bg-surface transition-all pointer-events-auto"
        >
          <CloseIcon className="size-5  fill-text-muted" />
        </button>
        <Text variant="body1">
          Once you are satisfied, you can end the chat by clicking this button.
          Be careful, as this will permanently disable the chat.
        </Text>
      </div>
    </div>
  ),
  [OnboardingStep.JobsTab]: ({ close }: { close?: () => void }) => (
    <div className="w-[400px] rounded-lg border border-primary-default bg-background absolute -bottom-10 right-1/2 transform translate-x-1/2 translate-y-[100%] pointer-events-none">
      <div className="w-full h-full relative flex flex-col gap-2 p-5 items-center">
        <button
          onClick={close}
          className="absolute top-1 right-1 rounded-full hover:bg-surface transition-all pointer-events-auto"
        >
          <CloseIcon className="size-5  fill-text-muted" />
        </button>
        <Text variant="body1">
          Use the <span className="text-primary-default">My Jobs</span> tab to
          view jobs. Click on a job to see that job's optimized resume.
        </Text>
      </div>
    </div>
  ),
  [OnboardingStep.ResumeTab]: ({ close }: { close?: () => void }) => (
    <div className="w-[300px] rounded-lg border border-primary-default bg-background absolute -bottom-10 right-1/2 transform translate-x-1/2 translate-y-[100%] pointer-events-none">
      <div className="w-full h-full relative flex flex-col gap-2 p-5 items-center">
        <button
          onClick={close}
          className="absolute top-1 right-1 rounded-full hover:bg-surface transition-all pointer-events-auto"
        >
          <CloseIcon className="size-5  fill-text-muted" />
        </button>
        <Text variant="body1">
          Use the <span className="text-primary-default">My Resume</span> tab to
          view your current resume or upload a new one.
        </Text>
      </div>
    </div>
  ),
  [OnboardingStep.Complete]: () => null,
};

const OnboardingPopover = ({
  children,
  onboardingStep,
  nextStep,
  wrapperClassName,
  showOverlay = true,
  close,
}: {
  children: ReactNode;
  onboardingStep: OnboardingStep;
  nextStep: OnboardingStep;
  wrapperClassName?: string;
  showOverlay?: boolean;
  close?: () => void;
}) => {
  const {
    popoverStates: { [onboardingStep]: popoverOpen },
    setPopoverStates,
    updateStep,
    currentStep,
  } = useOnboardingContext();

  const closePopover = useMemo(
    () =>
      close ??
      (() =>
        setPopoverStates((prev) => ({ ...prev, [onboardingStep]: false }))),
    [close, onboardingStep, setPopoverStates]
  );

  const updateOnboardingStep = useCallback(() => {
    updateStep(nextStep).then(closePopover);
  }, [closePopover, nextStep, updateStep]);

  const PopoverComponent = useMemo(
    () => onboardingPopoverContent[onboardingStep],
    [onboardingStep]
  );

  if (!currentStep || !popoverOpen) return children;

  return currentStep === onboardingStep ? (
    <>
      {showOverlay && (
        <div className="fixed w-screen h-screen bg-secondary-dark/20 backdrop-blur-md top-0 left-0 z-20" />
      )}
      <div
        onClick={updateOnboardingStep}
        className={twMerge(
          "bg-background rounded-md shadow-background shadow-[0px_0px_10px_10px] z-20 relative",
          wrapperClassName
        )}
      >
        <PopoverComponent close={close} />
        {children}
      </div>
    </>
  ) : (
    children
  );
};

export default OnboardingPopover;
