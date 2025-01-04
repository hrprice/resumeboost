import { Route, Routes, useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useAuthContext } from "./state/use-auth-context.tsx";
import { Typography } from "@mui/material";
import LoginPage from "./pages/Login.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import ChatPage from "./pages/chat/ChatPage.tsx";

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
