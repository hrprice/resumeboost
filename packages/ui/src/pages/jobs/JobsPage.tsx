import Skeleton from "@resume-optimizer/ui/components/Skeleton";
import {
  GetAllConversationsQuery,
  useGetAllConversationsQuery,
} from "@resume-optimizer/ui/graphql/jobs/jobs";
import _ from "lodash";
import { ReactNode, useMemo } from "react";
import Text from "@resume-optimizer/ui/components/Text";
import StorefrontIcon from "@material-symbols/svg-400/rounded/storefront.svg?react";
import LocationIcon from "@material-symbols/svg-400/rounded/location_on.svg?react";
import BadgeIcon from "@material-symbols/svg-400/rounded/id_card.svg?react";
import LinkIcon from "@material-symbols/svg-400/rounded/link.svg?react";
import { Link } from "react-router-dom";
import { getBaseUrl } from "@resume-optimizer/ui/utils/utils";

const JobCardItem = ({
  content,
  icon,
  url,
}: {
  content?: string | null;
  icon: ReactNode;
  url?: string;
}) => {
  if (!content) return null;
  if (url)
    return (
      <Link
        to={url}
        className="flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {icon}
        <Text variant="subtitle1">{getBaseUrl(url)}</Text>
      </Link>
    );
  return (
    <div className="flex gap-2">
      {icon}
      <Text variant="subtitle1">{content}</Text>
    </div>
  );
};

const JobCard = ({
  jobTitle,
  url,
  location,
  companyName,
  employmentType,
  jobId,
  isActive,
}: Omit<
  GetAllConversationsQuery["getAllConversations"][number]["jobDescription"],
  "__typename"
> & {
  isActive: boolean;
}) => {
  return (
    <Link
      to={isActive ? `/chat` : `/jobs/${jobId}`}
      className="w-full h-fit border border-secondary-dark rounded-lg flex justify-between p-4 hover:bg-secondary-light/20"
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-1">
          <Text variant="h6">{jobTitle}</Text>
        </div>
        <div className="grid grid-cols-2">
          <JobCardItem
            icon={<StorefrontIcon className="size-6 fill-secondary-default" />}
            content={companyName}
          />
          <JobCardItem
            icon={<LocationIcon className="size-6 fill-secondary-default" />}
            content={location}
          />
          <JobCardItem
            icon={<BadgeIcon className="size-6 fill-secondary-default" />}
            content={employmentType}
          />
          <JobCardItem
            icon={<LinkIcon className="size-6 fill-secondary-default" />}
            content={getBaseUrl(url)}
            url={url}
          />
        </div>
      </div>
      <div className=""></div>
    </Link>
  );
};

const JobsPage = () => {
  const { data, loading } = useGetAllConversationsQuery();

  const jobs = useMemo(
    () =>
      data?.getAllConversations.map(({ jobDescription, isActive }) => ({
        ..._.omit(jobDescription, "__typename"),
        isActive,
      })) || [],
    [data]
  );

  return (
    <div className="flex h-full justify-center bg-surface">
      <div className="container h-full flex items-center justify-center p-4 bg-background overflow-auto">
        <Skeleton
          loading={loading}
          wrapperClassName="flex md:grid grid-cols-2 gap-2"
        >
          {jobs.map((job) => (
            <JobCard key={job.url} {...job} />
          ))}
        </Skeleton>
      </div>
    </div>
  );
};
export default JobsPage;
