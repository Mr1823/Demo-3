import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useOrders = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidQuery = !isAuthLoading && user !== null && user !== undefined;

  const {
    data: orders,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["orders", user?._id || user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders");
      return res.data;
    },
  });

  const isOrdersLoading = isAuthLoading || (hasValidQuery && isQueryLoading);

  // get total amount spent on the orders
  const [totalSpent, setTotalSpent] = useState(0);
  useEffect(() => {
    if (orders && user) {
      const sum = orders.reduce((totalAmount, item) => {
        return totalAmount + parseFloat(item.totalAmount || item.total || 0);
      }, 0);

      setTotalSpent(sum.toFixed(2));
    }
  }, [orders, user]);

  return { orders, isOrdersLoading, refetch, totalSpent };
};

export default useOrders;
