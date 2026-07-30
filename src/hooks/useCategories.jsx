import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useCategories = () => {
  const { isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidQuery = !isAuthLoading;

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    refetch,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return Array.isArray(res.data) ? res.data : (res.data?.data || []);
    },
  });

  return { categories, isCategoriesLoading, refetch };
};

export default useCategories;
