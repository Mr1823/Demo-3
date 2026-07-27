import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useAllReviews = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidQuery = !isAuthLoading && user !== null && user !== undefined;

  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    refetch,
    isError,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["allReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reviews");
      return Array.isArray(res.data) ? res.data : (res.data?.data || []);
    },
  });

  return { reviews, isReviewsLoading, isError, refetch };
};

export default useAllReviews;
