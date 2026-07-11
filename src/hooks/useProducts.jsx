import axios from "axios";
import { useQuery } from "react-query";
import { getApiBaseUrl } from "../utils/apiConfig";

const useProducts = () => {
  const {
    data: products,
    isLoading: isProductsLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const apiBaseUrl = getApiBaseUrl();
      const res = await axios.get(`${apiBaseUrl}/products`);
      return Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
    },
  });

  return [products, isProductsLoading, refetch];
};

export default useProducts;
