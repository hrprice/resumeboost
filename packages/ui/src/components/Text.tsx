import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "subtitle1"
  | "subtitle2"
  | "button"
  | "overline"
  | "caption";

const TEXT_STYLES: Record<TextVariant, string> = {
  h1: "text-7xl font-light tracking-h1",
  h2: "text-6xl font-light tracking-tightest",
  h3: "text-5xl font-normal tracking-tighter",
  h4: "text-4xl font-normal tracking-tight",
  h5: "text-3xl font-normal tracking-tighter",
  h6: "text-2xl font-medium tracking-h6",
  subtitle1: "text-xl font-normal tracking-h5",
  subtitle2: "text-base font-medium tracking-subtitle2",
  body1: "text-xl font-normal tracking-normal",
  body2: "text-base font-normal tracking-tight",
  button: "text-base font-medium tracking-wide",
  caption: "text-sm font-normal tracking-caption",
  overline: "text-xs font-normal tracking-widest",
};

const Text = ({
  children,
  variant = "body1",
  className,
}: {
  children: ReactNode;
  variant?: TextVariant;
  className?: string;
}) => {
  return (
    <span className={twMerge(TEXT_STYLES[variant], className)}>{children}</span>
  );
};
export default Text;
