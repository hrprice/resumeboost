import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { OnboardingStep } from "@resume-optimizer/ui/graphql/graphql";

export type OnboardingPopoverStatesRecord = Record<OnboardingStep, boolean>;
export const BASE_ONBOARDING_POPOVER_STATES: OnboardingPopoverStatesRecord = {
  ...(Object.fromEntries(
    Object.values(OnboardingStep).map((step) => [step, true])
  ) as OnboardingPopoverStatesRecord),
  [OnboardingStep.ResumeUpdate]: false,
}; // This prevents the ResumeUpdate modal from being rendered when the page loads. It will only be rendered when its state is explicitly set to true

export const OnboardingContext = createContext<{
  popoverStates: OnboardingPopoverStatesRecord;
  setPopoverStates: Dispatch<SetStateAction<OnboardingPopoverStatesRecord>>;
  currentStep: OnboardingStep | undefined;
  updateStep: (s: OnboardingStep) => Promise<void>;
}>({
  popoverStates: BASE_ONBOARDING_POPOVER_STATES,
  setPopoverStates: () => {},
  currentStep: undefined,
  updateStep: () => new Promise(() => {}),
});

export const useOnboardingContext = () => useContext(OnboardingContext);
