import { ReactNode, useEffect, useState } from "react";
import AxiosContext from "./axios-context";
import { useAuthContext } from "./use-auth-context";
import axios from "axios";

const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const getAccessToken = async () => {
      const tkn = await user?.getIdToken();
      setToken(tkn);
    };
    getAccessToken();
  }, [user]);

  const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
    headers: { Authorization: `Bearer ${token}` },
  });

  return (
    <AxiosContext.Provider value={axiosClient}>
      {children}
    </AxiosContext.Provider>
  );
};
export default AxiosProvider;
