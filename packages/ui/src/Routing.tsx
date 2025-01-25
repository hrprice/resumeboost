import { Route, Routes, useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";
import Text from "@resume-optimizer/ui/components/Text";
import Login from "@resume-optimizer/ui/pages/auth/Login";
import HomePage from "@resume-optimizer/ui/pages/home/HomePage";
import ChatPage from "@resume-optimizer/ui/pages/chat/ChatPage";
import Signup from "@resume-optimizer/ui/pages/auth/Signup";
import JobsPage from "@resume-optimizer/ui/pages/jobs/JobsPage";
import JobDetailsPage from "@resume-optimizer/ui/pages/jobs/JobDetailsPage";
import { useBreakpoint } from "./state/use-breakpoint";
import MobileComingSoonPage from "./pages/MobileComingSoonPage";
import ResumePage from "./pages/resume/ResumePage";

const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  return children;
};

const Routing = () => {
  const isMobile = !useBreakpoint("sm");

  if (isMobile) return <MobileComingSoonPage />;

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
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
        path="/jobs/:conversationId"
        element={
          <AuthenticatedRoute>
            <JobDetailsPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <AuthenticatedRoute>
            <ResumePage />
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
        element={
          <div className="flex justify-center bg-surface">
            <div className="bg-background container h-full flex items-center justify-center">
              <Text variant="h4" className="text-primary-default">
                Page not found
              </Text>
            </div>
          </div>
        }
      />
    </Routes>
  );
};
export default Routing;
