import { ReactNode, useEffect, useState } from "react";
import {
  BreakpointContext,
  ScreenSize,
} from "@resume-optimizer/ui/state/breakpoint-context";

const screenSizes: [number, ScreenSize][] = [
  [600, "sm"],
  [900, "md"],
  [1200, "lg"],
  [1536, "xl"],
];

const BreakpointProvider = ({ children }: { children: ReactNode }) => {
  const [breakpoint, setBreakpoint] = useState<ScreenSize | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const [, currentBreakpoint] =
        screenSizes.find(([size]) => size > window.innerWidth) || [];
      setBreakpoint(currentBreakpoint || "xl");
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <BreakpointContext.Provider value={breakpoint || null}>
      {children}
    </BreakpointContext.Provider>
  );
};
export default BreakpointProvider;
