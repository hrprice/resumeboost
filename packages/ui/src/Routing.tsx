import { Route, Routes, useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";
import { Typography } from "@mui/material";
import Login from "@resume-optimizer/ui/pages/auth/Login";
import HomePage from "@resume-optimizer/ui/pages/home/HomePage";
import ChatPage from "@resume-optimizer/ui/pages/chat/ChatPage";
import Signup from "@resume-optimizer/ui/pages/auth/Signup";

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
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<ChatPage />} />
      {/* <Route path="/verify-email" element={<VerifyEmail />} /> */}
      <Route
        path="/"
        element={
          <AuthenticatedRoute>
            <HomePage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="*"
        element={<Typography variant="h4">Page Not Found</Typography>}
      />
    </Routes>
  );
};
export default Routing;
