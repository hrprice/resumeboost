import { useContext } from "react";
import {
  BreakpointContext,
  ScreenSize,
} from "@resume-optimizer/ui/state/breakpoint-context";

const orderedScreenSizes: ScreenSize[] = ["sm", "md", "lg", "xl", "2xl"];

export const useBreakpoint = (breakpoint: ScreenSize) => {
  const currentScreenSize = useContext(BreakpointContext);
  if (!currentScreenSize) return false;
  const screenSizeIdx = orderedScreenSizes.indexOf(breakpoint);
  return orderedScreenSizes.includes(currentScreenSize, screenSizeIdx);
};
