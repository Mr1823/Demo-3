import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useRates = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidQuery = !isAuthLoading && user !== null && user !== undefined;

  const {
    data: rates,
    isLoading: isRatesLoading,
    refetch,
    isError,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["rates"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rates");
      return res.data;
    },
  });

  return { rates, isRatesLoading, isError, refetch };
};

export default useRates;
