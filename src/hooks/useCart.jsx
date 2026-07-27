import React from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import toast from "react-hot-toast";
import useAxiosSecure from "./useAxiosSecure";

const useCart = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidQuery = !isAuthLoading && user !== null && user !== undefined;

  const {
    data: cartData,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["cart", user?._id || user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/cart");
      return res.data;
    },
  });

  const isCartLoading = isAuthLoading || (hasValidQuery && isQueryLoading);

  // fetch subtotal amount of cart
  const { data: cartSubtotal } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["cart-subtotal", user?._id || user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/cart/subtotal");
      return res.data;
    },
  });

  // post product data to cart
  const addToCart = async (productData, quantity = 1) => {
    if (!isAuthLoading && user) {
      const { _id, productId, name, img, image, category, price, discountPrice } = productData;

      const cartProductData = {
        productId: productId || _id,
        name,
        img: img || image,
        image: img || image,
        category,
        price: discountPrice || price,
        quantity,
      };

      axiosSecure.post("/cart", cartProductData).then((res) => {
        if (res.data?.insertedId || res.data?.success) {
          toast.success("Cart Updated", {
            position: "bottom-right",
          });
          refetch();
        }
      });
    }
  };

  return { cartData, isCartLoading, refetch, addToCart, cartSubtotal };
};

export default useCart;
