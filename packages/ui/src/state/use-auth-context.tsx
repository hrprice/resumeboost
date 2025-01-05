import { useContext } from "react";
import { AuthContext } from "@resume-optimizer/ui/state/auth-context";

export const useAuthContext = () => useContext(AuthContext);
