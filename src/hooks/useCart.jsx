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

  // calculate subtotal amount of cart directly from cartData
  const cartSubtotal = {
    subtotal: cartData?.reduce((total, item) => {
      return total + ((item.price || item.discountPrice || 0) * (item.quantity || 1));
    }, 0) || 0
  };

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

  const updateCartQuantity = async (itemId, quantity) => {
    if (!isAuthLoading && user) {
      axiosSecure.patch(`/cart/${itemId}`, { quantity }).then((res) => {
        if (res.data?.success) {
          refetch();
          // We don't want a toast every time they click + or -, so we omit toast or use a subtle one
        }
      });
    }
  };

  return { cartData, isCartLoading, refetch, addToCart, updateCartQuantity, cartSubtotal };
};

export default useCart;
