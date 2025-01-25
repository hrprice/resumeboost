import { ReactNode, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { AuthContext } from "@resume-optimizer/ui/state/auth-context";
import { useNavigate } from "react-router-dom";
import CircularProgressBox from "../components/CircularProgressBox";

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const app = initializeApp({
    apiKey: import.meta.env.VITE_GCP_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  });
  const auth = getAuth(app);

  // Firebase stores the auth state in localstorage by default
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUserState(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setUserState(user);
    },
    [auth]
  );

  const logout = useCallback(async () => {
    await signOut(auth).then(() => navigate("/login"));
  }, [auth, navigate]);

  return loading ? (
    <CircularProgressBox wrapperClassName="h-screen" />
  ) : (
    <AuthContext.Provider value={{ user: userState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
