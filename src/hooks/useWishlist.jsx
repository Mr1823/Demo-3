import React from "react";
import useAuthContext from "./useAuthContext";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "./useAxiosSecure";

const useWishlist = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidQuery = !isAuthLoading && user !== null && user !== undefined;

  const {
    data: wishlistData,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["wishlist", user?._id || user?.userId],
    queryFn: async () => {
      const res = await axiosSecure.get("/wishlist");
      return res.data;
    },
  });

  const isWishlistLoading = isAuthLoading || (hasValidQuery && isQueryLoading);

  const addToWishlist = React.useCallback((productData) => {
    if (!isAuthLoading && user) {
      const { _id, productId, name, img, image, images, category, price } = productData;
      const wishlistPayload = {
        productId: productId || _id,
        name,
        img: img || image || (images && images[0]) || "/logo.png",
        image: img || image || (images && images[0]) || "/logo.png",
        category,
        price,
      };

      axiosSecure
        .post("/wishlist", wishlistPayload)
        .then((res) => {
          if (res.data?.insertedId || res.data?.success) {
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
  }, [isAuthLoading, user, axiosSecure, refetch]);

  return [wishlistData, isWishlistLoading, refetch, addToWishlist];
};

export default useWishlist;
