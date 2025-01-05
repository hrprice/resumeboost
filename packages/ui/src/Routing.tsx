import { Route, Routes, useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";
import { Typography } from "@mui/material";
import LoginPage from "@resume-optimizer/ui/pages/Login";
import HomePage from "@resume-optimizer/ui/pages/home/HomePage";
import ChatPage from "@resume-optimizer/ui/pages/chat/ChatPage";

const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  return <>{children}</>;
};

const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/" element={<HomePage />} />
      <Route
        path="*"
        element={<Typography variant="h4">Page Not Found</Typography>}
      />
    </Routes>
  );
};
export default Routing;
