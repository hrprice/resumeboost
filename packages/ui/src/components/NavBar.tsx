import Text from "@resume-optimizer/ui/components/Text";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";
import { Link } from "react-router-dom";
import LogoutIcon from "@material-symbols/svg-400/rounded/logout-fill.svg?react";
import { useBreakpoint } from "@resume-optimizer/ui/state/use-breakpoint";
import OnboardingPopover from "@resume-optimizer/ui/components/OnboardingPopover";
import { OnboardingStep } from "@resume-optimizer/ui/graphql/graphql";

const NavBarLink = ({ title, link }: { title: string; link: string }) => {
  const isMediumOrSmaller = !useBreakpoint("md");

  return (
    <Link
      key={title}
      className="px-2 md:px-10 hover:bg-gray-200 h-full flex items-center transition-all duration-200"
      to={link}
    >
      <Text variant={isMediumOrSmaller ? "subtitle2" : "subtitle1"}>
        {title}
      </Text>
    </Link>
  );
};

const NAVBAR_LINKS = [
  {
    component: (
      <OnboardingPopover
        key="jobs"
        onboardingStep={OnboardingStep.JobsTab}
        nextStep={OnboardingStep.ResumeTab}
        showOverlay={false}
        wrapperClassName="bg-primary-default/50 shadow-primary-default/50"
      >
        <NavBarLink title="My Jobs" link="/jobs" />
      </OnboardingPopover>
    ),
  },
  {
    component: (
      <OnboardingPopover
        key="resume"
        onboardingStep={OnboardingStep.ResumeTab}
        nextStep={OnboardingStep.Complete}
        showOverlay={false}
        wrapperClassName="bg-primary-default/50 shadow-primary-default/50"
      >
        <NavBarLink title="My Resume" link="/resume" />
      </OnboardingPopover>
    ),
  },
  {
    component: (
      <OnboardingPopover
        key="chat"
        onboardingStep={OnboardingStep.StartChat}
        nextStep={OnboardingStep.SendMessage}
      >
        <NavBarLink title="Chat" link="/chat" />
      </OnboardingPopover>
    ),
  },
];

const NavBar = () => {
  const { logout, user } = useAuthContext();
  const isMediumOrSmaller = !useBreakpoint("md");

  return (
    <div className="md:h-20 h-fit border-b flex justify-center w-full pt-2 md:pt-0">
      <div className="justify-between flex items-start md:items-center md:container w-full flex-col md:flex-row px-4 md:p-0">
        <Link to="/">
          <Text
            variant={isMediumOrSmaller ? "h5" : "h4"}
            className="font-extrabold text-primary-default"
          >
            JobJunkie.ai
          </Text>
        </Link>
        {user && (
          <div className="flex gap-0 md:gap-20 h-full items-center justify-between w-full md:w-fit">
            <div className="flex h-full">
              {NAVBAR_LINKS.map(({ component }) => component)}
            </div>
            <button
              className="rounded-full p-2 h-fit hover:bg-gray-200"
              onClick={logout}
            >
              <LogoutIcon className="size-8 fill-secondary-dark" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default NavBar;
