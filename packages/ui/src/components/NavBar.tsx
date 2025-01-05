import Text from "@resume-optimizer/ui/components/Text";

const NavBar = () => {
  return (
    <div className="absolue top-0 h-20 border-b flex justify-center">
      <div className="justify-between flex items-center container w-full">
        <Text variant="h4" className="font-extrabold text-primary-default">
          JobJunkie.ai
        </Text>
      </div>
    </div>
  );
};
export default NavBar;
