import Text from "@resume-optimizer/ui/components/Text";
import classNames from "classnames";
import {
  TextContent,
  TextContentType,
} from "@resume-optimizer/shared/socket-constants";
import CheckIcon from "@material-symbols/svg-400/rounded/task_alt-fill.svg?react";
import { twMerge } from "tailwind-merge";
import OnboardingPopover from "@resume-optimizer/ui/components/OnboardingPopover";
import { OnboardingStep } from "@resume-optimizer/ui/graphql/graphql";
import { useOnboardingContext } from "@resume-optimizer/ui/state/onboarding-context";

const TextDisplay = ({ content }: { content: TextContent[] }) => {
  return (
    <div className="bg-background w-full p-4" style={{ aspectRatio: 8.5 / 11 }}>
      {content.map(({ content: textContent, type }) => (
        <Text
          key={textContent.slice(10)}
          className={classNames(
            "whitespace-pre-wrap text-md transition-opacity",
            { "bg-accent/20": type === TextContentType.Updated }
          )}
        >
          {textContent}
        </Text>
      ))}
    </div>
  );
};

const ResumeEditor = ({
  resumeTextContent,
  onComplete,
  className,
}: {
  resumeTextContent: TextContent[][];
  onComplete?: () => void;
  className?: string;
}) => {
  const {
    popoverStates: { [OnboardingStep.ResumeUpdate]: popoverOpen },
    currentStep,
  } = useOnboardingContext();

  return (
    <div
      className={twMerge(
        "w-[65%] h-full border bg-secondary-light flex rounded-xl flex-col gap-4 relative overflow-hidden",
        className
      )}
    >
      {onComplete && (
        <OnboardingPopover
          onboardingStep={OnboardingStep.ResumeUpdate}
          nextStep={OnboardingStep.JobsTab}
          wrapperClassName="absolute w-fit h-fit top-5 right-5 rounded-full bg-primary-default/50 shadow-primary-default/50"
          showOverlay={false}
        >
          <button
            onClick={onComplete}
            className={classNames(
              "w-fit h-fit top-5 right-5 rounded-full hover:bg-success/20 p-1 transition-all duration-200",
              {
                absolute:
                  !popoverOpen || currentStep !== OnboardingStep.ResumeUpdate,
              }
            )}
          >
            <CheckIcon className="size-10 fill-success" />
          </button>
        </OnboardingPopover>
      )}
      <div className="overflow-auto p-4 w-full h-full">
        <div className="flex-col flex h-fit gap-4">
          {resumeTextContent?.map((page) => (
            <TextDisplay key={page[0].content[0].slice(10)} content={page} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default ResumeEditor;
