import { SnackbarProvider } from "notistack";
import AuthContextProvider from "./state/AuthContextProvider";
import Routing from "./Routing";
import { BrowserRouter } from "react-router-dom";
import BreakpointProvider from "./state/BreakpointProvider";
import NavBar from "./components/NavBar";

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
