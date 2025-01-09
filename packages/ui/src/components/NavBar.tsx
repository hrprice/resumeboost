import Text from "@resume-optimizer/ui/components/Text";
import { useAuthContext } from "../state/use-auth-context";

const NavBar = () => {
  const { logout } = useAuthContext();
  return (
    <div className="absolue top-0 h-20 border-b flex justify-center">
      <div className="justify-between flex items-center container w-full">
        <Text variant="h4" className="font-extrabold text-primary-default">
          JobJunkie.ai
        </Text>
        <button onClick={logout}>logout</button>
      </div>
    </div>
  );
};
export default NavBar;
