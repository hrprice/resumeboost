import { ReactNode } from "react";
import Text from "@resume-optimizer/ui/components/Text";
import { Link } from "react-router-dom";
import { getBaseUrl } from "@resume-optimizer/ui/utils/utils";
import { twMerge } from "tailwind-merge";

const JobCardItem = ({
  content,
  icon,
  url,
  className,
}: {
  content?: string | null;
  icon: ReactNode;
  url?: string;
  className?: string;
}) => {
  if (!content) return null;
  if (url)
    return (
      <Link
        to={url}
        className={twMerge("flex gap-2", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {icon}
        <Text
          title={content}
          variant="subtitle1"
          className="max-w-full truncate"
        >
          {getBaseUrl(url)}
        </Text>
      </Link>
    );
  return (
    <div className={twMerge("flex gap-2 w-fit max-w-full", className)}>
      <div className="w-fit">{icon}</div>
      <Text title={content} variant="subtitle1" className="max-w-full truncate">
        <span>{content}</span>
      </Text>
    </div>
  );
};
export default JobCardItem;
