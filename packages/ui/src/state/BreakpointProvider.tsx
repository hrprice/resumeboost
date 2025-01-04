import { ReactNode, useEffect, useState } from "react";
import { BreakpointContext, ScreenSize } from "./breakpoint-context.tsx";

const screenSizes: [number, ScreenSize][] = [
  [640, "sm"],
  [768, "md"],
  [1024, "lg"],
  [1280, "xl"],
  [1536, "2xl"],
];

const BreakpointProvider = ({ children }: { children: ReactNode }) => {
  const [breakpoint, setBreakpoint] = useState<ScreenSize | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const [, currentBreakpoint] =
        screenSizes.find(([size]) => size <= window.innerWidth) || [];
      setBreakpoint(currentBreakpoint || null);
    };

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
