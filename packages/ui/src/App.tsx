import { SnackbarProvider } from "notistack";
import AuthContextProvider from "@resume-optimizer/ui/state/AuthContextProvider";
import Routing from "@resume-optimizer/ui/Routing";
import { BrowserRouter } from "react-router-dom";
import BreakpointProvider from "@resume-optimizer/ui/state/BreakpointProvider";
import NavBar from "@resume-optimizer/ui/components/NavBar";
import ApolloProviderWrapper from "@resume-optimizer/ui/state/ApolloProviderWrapper";
import AxiosProvider from "./state/AxiosProvider";
import SocketIoProvider from "./state/SocketIoProvider";

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ApolloProviderWrapper>
          <AxiosProvider>
            <SocketIoProvider>
              <BreakpointProvider>
                <SnackbarProvider>
                  <div className="relative h-screen flex flex-col">
                    <NavBar />
                    <Routing />
                  </div>
                </SnackbarProvider>
              </BreakpointProvider>
            </SocketIoProvider>
          </AxiosProvider>
        </ApolloProviderWrapper>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
