import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useProducts = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidQuery = !isAuthLoading && user !== null && user !== undefined;

  const {
    data: products,
    isLoading: isProductsLoading,
    refetch,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
    },
  });

  return [products, isProductsLoading, refetch];
};

export default useProducts;
