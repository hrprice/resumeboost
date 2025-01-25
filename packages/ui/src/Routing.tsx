import { Route, Routes, useNavigate } from "react-router-dom";
import { ReactNode, Suspense, lazy, useEffect } from "react";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";
import Text from "@resume-optimizer/ui/components/Text";
import { useBreakpoint } from "./state/use-breakpoint";

// Lazy imports for the components
const Login = lazy(() => import("@resume-optimizer/ui/pages/auth/Login"));
const Signup = lazy(() => import("@resume-optimizer/ui/pages/auth/Signup"));
const HomePage = lazy(() => import("@resume-optimizer/ui/pages/home/HomePage"));
const ChatPage = lazy(() => import("@resume-optimizer/ui/pages/chat/ChatPage"));
const JobsPage = lazy(() => import("@resume-optimizer/ui/pages/jobs/JobsPage"));
const JobDetailsPage = lazy(
  () => import("@resume-optimizer/ui/pages/jobs/JobDetailsPage")
);
const MobileComingSoonPage = lazy(
  () => import("@resume-optimizer/ui/pages/MobileComingSoonPage")
);
const ResumePage = lazy(
  () => import("@resume-optimizer/ui/pages/resume/ResumePage")
);
const CircularProgressBox = lazy(
  () => import("@resume-optimizer/ui/components/CircularProgressBox")
);

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
    <Suspense fallback={<CircularProgressBox />}>
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
    </Suspense>
  );
};
export default Routing;
