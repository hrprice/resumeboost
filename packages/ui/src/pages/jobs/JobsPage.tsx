import {
  GetAllConversationsQuery,
  useGetAllConversationsQuery,
} from "@resume-optimizer/ui/graphql/jobs/jobs";
import _ from "lodash";
import { useCallback, useMemo } from "react";
import Text from "@resume-optimizer/ui/components/Text";
import StorefrontIcon from "@material-symbols/svg-400/rounded/storefront.svg?react";
import LocationIcon from "@material-symbols/svg-400/rounded/location_on.svg?react";
import BadgeIcon from "@material-symbols/svg-400/rounded/id_card.svg?react";
import LinkIcon from "@material-symbols/svg-400/rounded/link.svg?react";
import { useNavigate } from "react-router-dom";
import { getBaseUrl } from "@resume-optimizer/ui/utils/utils";
import JobCardItem from "@resume-optimizer/ui/pages/jobs/components/JobCardItem";
import CircularProgressBox from "@resume-optimizer/ui/components/CircularProgressBox";

const JobCard = ({
  jobTitle,
  url,
  location,
  companyName,
  employmentType,
  conversationId,
  isActive,
}: Omit<
  GetAllConversationsQuery["getAllConversations"][number]["jobDescription"],
  "__typename"
> & {
  isActive: boolean;
  conversationId: string;
}) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(isActive ? `/chat` : `/jobs/${conversationId}`);
  }, [navigate, isActive, conversationId]);

  return (
    <button
      onClick={handleClick}
      className="w-full h-fit border border-secondary-dark rounded-lg flex flex-col gap-6 justify-between p-4 hover:bg-secondary-light/20 transition-all duration-300"
    >
      <Text variant="h6" className="text-left">
        {jobTitle}
      </Text>
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
    </button>
  );
};

const JobsPage = () => {
  const { data, loading } = useGetAllConversationsQuery();

  const jobs = useMemo(
    () =>
      data?.getAllConversations.map(
        ({ jobDescription, isActive, conversationId }) => ({
          ..._.omit(jobDescription, "__typename"),
          isActive,
          conversationId,
        })
      ) || [],
    [data]
  );

  return (
    <div className="flex h-full justify-center bg-surface">
      <div className="md:container h-full flex items-start justify-center p-4 bg-background overflow-auto">
        {loading ? (
          <CircularProgressBox />
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 h-fit">
            {jobs.map((job) => (
              <JobCard key={job.url} {...job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default JobsPage;
