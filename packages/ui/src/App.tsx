import { SnackbarProvider } from "notistack";
import AuthContextProvider from "@resume-optimizer/ui/state/AuthContextProvider";
import Routing from "@resume-optimizer/ui/Routing";
import { BrowserRouter } from "react-router-dom";
import BreakpointProvider from "@resume-optimizer/ui/state/BreakpointProvider";
import NavBar from "@resume-optimizer/ui/components/NavBar";

const App = () => {
  return (
    <BrowserRouter>
      <BreakpointProvider>
        <SnackbarProvider>
          <AuthContextProvider>
            <div className="relative h-screen flex flex-col">
              <NavBar />
              <Routing />
            </div>
          </AuthContextProvider>
        </SnackbarProvider>
      </BreakpointProvider>
    </BrowserRouter>
  );
};

export default App;
