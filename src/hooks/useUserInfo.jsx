import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useUserInfo = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();
  const [totalSpentArray, setTotalSpentArray] = useState([]);

  const hasValidQuery = !isAuthLoading && user !== null && user !== undefined;

  const {
    data: userFromDB,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    enabled: hasValidQuery,
    queryKey: ["user", user?._id || user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/me");
      return res.data?.data || res.data;
    },
  });

  const isUserLoading = isAuthLoading || (hasValidQuery && isQueryLoading);

  // Determine admin status from user data
  const isAdmin = userFromDB?.role === "ADMIN" || user?.role === "ADMIN";

  // Attach admin flag for backward compatibility
  const enrichedUser = userFromDB
    ? { ...userFromDB, admin: userFromDB.role === "ADMIN" }
    : null;

  // Fetch total spent amount by users (admin only)
  useEffect(() => {
    if (!isAuthLoading && user && isAdmin) {
      axiosSecure
        .get("/admin/total-spent")
        .then((res) => {
          setTotalSpentArray(res.data);
        })
        .catch(() => {});
    }
  }, [isAdmin, isAuthLoading, user]);

  return [enrichedUser, isUserLoading, refetch, totalSpentArray];
};

export default useUserInfo;
