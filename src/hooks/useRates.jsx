import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuthContext from "./useAuthContext";

const useRates = () => {
  const { isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();
  const queryClient = useQueryClient();
  const hasValidUser = !isAuthLoading;

  const { data: rates, isLoading, refetch } = useQuery({
    enabled: hasValidUser,
    queryKey: ["rates"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rates");
      return res.data;
    },
  });

  const updateRates = useMutation({
    mutationFn: async (newRates) => {
      const res = await axiosSecure.patch("/rates", newRates);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rates"]);
    },
  });

  return { rates, isLoading, refetch, updateRates };
};

export default useRates;
