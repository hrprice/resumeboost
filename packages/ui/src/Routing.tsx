import { Route, Routes, useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";
import { Typography } from "@mui/material";
import Login from "@resume-optimizer/ui/pages/auth/Login";
import HomePage from "@resume-optimizer/ui/pages/home/HomePage";
import ChatPage from "@resume-optimizer/ui/pages/chat/ChatPage";
import Signup from "@resume-optimizer/ui/pages/auth/Signup";
import JobsPage from "@resume-optimizer/ui/pages/jobs/JobsPage";
import JobDetailsPage from "@resume-optimizer/ui/pages/jobs/JobDetailsPage";

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
      <Route
        path="/signup"
        element={
          <AuthenticatedRoute>
            <Signup />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthenticatedRoute>
            <Login />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <AuthenticatedRoute>
            <ChatPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <AuthenticatedRoute>
            <JobsPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/jobs/:jobId"
        element={
          <AuthenticatedRoute>
            <JobDetailsPage />
          </AuthenticatedRoute>
        }
      />
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
