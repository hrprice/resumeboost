import Text from "@resume-optimizer/ui/components/Text";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
      return;
    }
    if (user.emailVerified) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <Text className="text-secondary-dark" variant="h5">
        Verify your email address
      </Text>
      <Text className="text-secondary-default">
        A link has been sent to {user?.email}
      </Text>
    </div>
  );
};
export default VerifyEmail;
