import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  BASE_ONBOARDING_POPOVER_STATES,
  OnboardingContext,
  OnboardingPopoverStatesRecord,
} from "@resume-optimizer/ui/state/onboarding-context";
import CircularProgressBox from "../components/CircularProgressBox";
import {
  useGetOnboardingStepQuery,
  useUpdateOnboardingStepMutation,
} from "@resume-optimizer/ui/graphql/onboarding/onboarding";
import { OnboardingStep } from "../graphql/graphql";
import { useErrorBoundary } from "react-error-boundary";

const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [popoverStates, setPopoverStates] =
    useState<OnboardingPopoverStatesRecord>(BASE_ONBOARDING_POPOVER_STATES);
  const { data, loading, error } = useGetOnboardingStepQuery();
  const [updateOnboardingStepMutation] = useUpdateOnboardingStepMutation();
  const [currentStep, setCurrentStep] = useState<OnboardingStep | undefined>(
    data?.getOnboardingStep.onboardingStep
  );
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    setCurrentStep(data?.getOnboardingStep.onboardingStep);
  }, [data]);

  useEffect(() => {
    if (error) showBoundary(error);
  }, [error, showBoundary]);

  const updateStep = useCallback(
    async (nextStep: OnboardingStep) => {
      await updateOnboardingStepMutation({
        variables: { onboardingStep: nextStep },
      }).then(() => setCurrentStep(nextStep));
    },
    [updateOnboardingStepMutation]
  );

  if (!currentStep || !open) return children;

  if (loading)
    return <CircularProgressBox wrapperClassName="w-screen h-screen" />;
  return (
    <OnboardingContext.Provider
      value={{
        popoverStates,
        setPopoverStates,
        updateStep,
        currentStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
export default OnboardingProvider;
