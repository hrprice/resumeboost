import Text from "@resume-optimizer/ui/components/Text";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";
import { Link } from "react-router-dom";
import LogoutIcon from "@material-symbols/svg-400/rounded/logout-fill.svg?react";

const NAVBAR_LINKS = [
  { title: "My Jobs", link: "/jobs" },
  { title: "My Resume", link: "/resume" },
  { title: "Chat", link: "/chat" },
];

const NavBar = () => {
  const { logout, user } = useAuthContext();

  return (
    <div className="h-20 border-b flex justify-center">
      <div className="justify-between flex items-center container w-full">
        <Link to="/">
          <Text variant="h4" className="font-extrabold text-primary-default">
            JobJunkie.ai
          </Text>
        </Link>

        {user && (
          <div className="flex gap-20 h-full items-center justify-between">
            <div className="flex h-full">
              {NAVBAR_LINKS.map(({ title, link }) => (
                <Link
                  className="px-10 hover:bg-gray-200 h-full flex items-center transition-all duration-200"
                  to={link}
                >
                  <Text variant="subtitle1">{title}</Text>
                </Link>
              ))}
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
