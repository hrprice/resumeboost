import classNames from "classnames";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const Skeleton = ({
  children,
  loading,
  className,
  wrapperClassName,
}: {
  children?: ReactNode;
  loading: boolean;
  className?: string;
  wrapperClassName?: string;
}) => {
  return (
    <div className={twMerge("relative h-full w-full", wrapperClassName)}>
      <div
        className={twMerge(
          classNames("absolute inset-0 rounded-lg bg-gray-300 animate-pulse", {
            hidden: !loading,
          }),
          className
        )}
      />
      {children}
    </div>
  );
};

export default Skeleton;
