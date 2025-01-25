import Text from "@resume-optimizer/ui/components/Text";
import { useNavigate } from "react-router-dom";

const SomethingWentWrong = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 flex-col gap-4">
      <Text variant="h5" className="text-primary-default text-center">
        Something went wrong
      </Text>
      <button
        className="rounded-full bg-primary-dark p-2 px-4"
        onClick={() => navigate(0)}
      >
        <Text variant="h6" className="font-medium text-white">
          refresh
        </Text>
      </button>
    </div>
  );
};
export default SomethingWentWrong;
