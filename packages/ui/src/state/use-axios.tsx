import { useContext } from "react";
import AxiosContext from "./axios-context";

const useAxios = () => useContext(AxiosContext);

export default useAxios;
