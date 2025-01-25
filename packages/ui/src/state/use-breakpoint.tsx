import { useContext, useMemo } from "react";
import {
  BreakpointContext,
  ScreenSize,
} from "@resume-optimizer/ui/state/breakpoint-context";

const orderedScreenSizes: ScreenSize[] = ["sm", "md", "lg", "xl"];

export const useBreakpoint = (breakpoint: ScreenSize) => {
  const currentScreenSize = useContext(BreakpointContext);

  const isBreakpointMet = useMemo(() => {
    if (!currentScreenSize) return false;
    const breakpointIdx = orderedScreenSizes.indexOf(breakpoint);
    const currentIdx = orderedScreenSizes.indexOf(currentScreenSize);
    return currentIdx > breakpointIdx;
  }, [currentScreenSize, breakpoint]);

  return isBreakpointMet;
};
