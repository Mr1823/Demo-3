import React from "react";
import useAuthContext from "./useAuthContext";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "./useAxiosSecure";

const useWishlist = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidQuery =
    !isAuthLoading &&
    user?.uid !== undefined &&
    localStorage.getItem("the-jewel-store-jwt-token") !== null;

  const {
    data: wishlistData,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["wishlist", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist?email=${user?.email}`);
      return res.data;
    },
  });

  const isWishlistLoading = isAuthLoading || (hasValidQuery && isQueryLoading);

  const addToWishlist = (productData) => {
    if (!isAuthLoading && user?.uid !== undefined) {
      const { ["_id"]: excludedKey, ...otherProps } = productData;
      const wishlistData = {
        productId: excludedKey,
        email: user?.email,
        ...otherProps,
      };

      // post data to wishlist db
      axiosSecure
        .post(`/wishlist?email=${user?.email}`, wishlistData)
        .then((res) => {
          if (res.data?.insertedId) {
            toast.success("Item added to your wishlist!", {
              position: "bottom-right",
            });
            refetch();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return [wishlistData, isWishlistLoading, refetch, addToWishlist];
};

export default useWishlist;
