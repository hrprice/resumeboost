import { ReactNode, useEffect } from "react";
import AxiosContext from "./axios-context";
import { useAuthContext } from "./use-auth-context";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI,
});

const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();

  useEffect(() => {
    const attachTokenInterceptor = async () => {
      axiosClient.interceptors.request.use(async (config) => {
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });
    };
    attachTokenInterceptor();
  }, [user]);

  return (
    <AxiosContext.Provider value={axiosClient}>
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosProvider;
