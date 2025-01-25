import { iJobDescription } from "@resume-optimizer/shared/socket-constants";
import Text from "@resume-optimizer/ui/components/Text";
import StorefrontIcon from "@material-symbols/svg-400/rounded/storefront.svg?react";
import LocationIcon from "@material-symbols/svg-400/rounded/location_on.svg?react";
import BadgeIcon from "@material-symbols/svg-400/rounded/id_card.svg?react";
import LinkIcon from "@material-symbols/svg-400/rounded/link.svg?react";
import JobCardItem from "@resume-optimizer/ui/pages/jobs/components/JobCardItem";
import { getBaseUrl } from "@resume-optimizer/ui/utils/utils";

const ChatPageHeader = ({
  jobTitle,
  companyName,
  location,
  employmentType,
  url,
}: iJobDescription) => {
  return (
    <div className="flex flex-col gap-2 w-full h-fit justify-center items-start">
      <Text variant="h5">{jobTitle}</Text>
      <div className="flex-wrap flex gap-4 justify-start items-start w-full">
        <JobCardItem
          className="max-w-[250px]"
          icon={<StorefrontIcon className="size-6 fill-secondary-default" />}
          content={companyName}
        />
        <JobCardItem
          className="max-w-[250px]"
          icon={<LocationIcon className="size-6 fill-secondary-default" />}
          content={location}
        />
        <JobCardItem
          className="max-w-[250px]"
          icon={<BadgeIcon className="size-6 fill-secondary-default" />}
          content={employmentType}
        />
        <JobCardItem
          className="max-w-[250px]"
          icon={<LinkIcon className="size-6 fill-secondary-default" />}
          content={getBaseUrl(url)}
          url={url}
        />
      </div>
    </div>
  );
};
export default ChatPageHeader;
