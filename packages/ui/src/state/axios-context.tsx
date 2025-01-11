import { createContext } from "react";
import axios, { AxiosInstance } from "axios";

const axiosClient = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URI });

const AxiosContext = createContext<AxiosInstance>(axiosClient);

export default AxiosContext;
