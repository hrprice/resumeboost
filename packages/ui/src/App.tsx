import { SnackbarProvider } from "notistack";
import AuthContextProvider from "@resume-optimizer/ui/state/AuthContextProvider";
import Routing from "@resume-optimizer/ui/Routing";
import { BrowserRouter } from "react-router-dom";
import BreakpointProvider from "@resume-optimizer/ui/state/BreakpointProvider";
import NavBar from "@resume-optimizer/ui/components/NavBar";
import ApolloProviderWrapper from "@resume-optimizer/ui/state/ApolloProviderWrapper";
import AxiosProvider from "@resume-optimizer/ui/state/AxiosProvider";
import SocketIoProvider from "@resume-optimizer/ui/state/SocketIoProvider";
import { ErrorBoundary } from "react-error-boundary";
import SomethingWentWrong from "@resume-optimizer/ui/pages/SomethingWentWrong";
import OnboardingProvider from "./state/OnboardingProvider";

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<SomethingWentWrong />}>
        <AuthContextProvider>
          <ApolloProviderWrapper>
            <AxiosProvider>
              <SocketIoProvider>
                <BreakpointProvider>
                  <SnackbarProvider>
                    <OnboardingProvider>
                      <div className="grid grid-rows-[min-content_1fr] grid-cols-1 min-h-screen relative z-0">
                        <NavBar />
                        <Routing />
                      </div>
                    </OnboardingProvider>
                  </SnackbarProvider>
                </BreakpointProvider>
              </SocketIoProvider>
            </AxiosProvider>
          </ApolloProviderWrapper>
        </AuthContextProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
