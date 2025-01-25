import { CircularProgress } from "@mui/material";
import { twMerge } from "tailwind-merge";

const CircularProgressBox = ({
  className,
  wrapperClassName,
}: {
  className?: string;
  wrapperClassName?: string;
}) => {
  return (
    <div
      className={twMerge(
        "w-full h-full flex justify-center items-center",
        wrapperClassName
      )}
    >
      <CircularProgress
        className={className}
        sx={{
          "& .MuiCircularProgress-circle": {
            stroke: "hsl(var(--tw-color-secondary-dark))",
          },
        }}
      />
    </div>
  );
};
export default CircularProgressBox;
