import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuthContext from "./useAuthContext";

const useQuotes = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();
  const queryClient = useQueryClient();
  const hasValidUser = !isAuthLoading && !!user;

  const { data: quotes, isLoading, refetch } = useQuery({
    enabled: hasValidUser,
    queryKey: ["quotes"],
    queryFn: async () => {
      const res = await axiosSecure.get("/quotes");
      return res.data?.data || [];
    },
  });

  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/quotes/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["quotes"]);
    },
  });

  return { quotes, isLoading, refetch, updateQuoteStatus };
};

export default useQuotes;
