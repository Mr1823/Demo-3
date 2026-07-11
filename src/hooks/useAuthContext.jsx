import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useAuthContext = () => {
  return useContext(AuthContext);
};

export default useAuthContext;
