import { createContext } from "react";

export type ScreenSize = "sm" | "md" | "lg" | "xl" | "2xl";
export const OrderedScreenSizes: ScreenSize[] = ["sm", "md", "lg", "xl", "2xl"];
export const BreakpointContext = createContext<ScreenSize | null>(null);
