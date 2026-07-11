import React from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import toast from "react-hot-toast";
import useAxiosSecure from "./useAxiosSecure";

const useCart = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidQuery =
    !isAuthLoading &&
    user?.uid !== undefined &&
    localStorage.getItem("the-jewel-store-jwt-token") !== null;

  const {
    data: cartData,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["cart", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/cart?email=${user?.email}`);
      return res.data;
    },
  });

  const isCartLoading = isAuthLoading || (hasValidQuery && isQueryLoading);

  // fetch subtotal amount of cart
  const { data: cartSubtotal } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["cart-subtotal", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/cart/subtotal?email=${user?.email}`);
      return res.data;
    },
  });

  // post product data to cart
  const addToCart = async (productData, quantity = 1) => {
    if (!isAuthLoading && user?.uid !== undefined) {
      const { _id, name, img, category, price, discountPrice } = productData;

      const cartProductData = {
        productId: _id,
        email: user?.email,
        name,
        img,
        category,
        price: discountPrice || price,
        quantity,
        addedAt: new Date(),
      };

      axiosSecure.post("/cart", cartProductData).then((res) => {
        if (res.data?.insertedId) {
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
