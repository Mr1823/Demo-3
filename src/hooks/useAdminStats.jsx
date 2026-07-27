import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useAdminStats = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();
  const [totalCategories, setTotalCategories] = useState(0);
  const [topCategories, setTopCategories] = useState([]);
  const [incomeStats, setIncomeStats] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  const hasValidUser = !isAuthLoading && user !== null && user !== undefined;

  const { data: adminStats } = useQuery({
    enabled: hasValidUser,
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/stats");
      return res.data;
    },
  });

  // TOP SELLING CATEGORIES
  useEffect(() => {
    if (hasValidUser) {
      axiosSecure.get("/admin-dashboard/top-selling-categories").then((res) => {
        setTotalCategories(res.data.totalCategories);
        setTopCategories(res.data.topCategories);
      }).catch(() => {});

      axiosSecure.get("/admin-dashboard/income-stats").then((res) => {
        setIncomeStats(res.data);
      }).catch(() => {});
    }
  }, [hasValidUser]);

  // BEST SELLING POPULAR PRODUCTS
  useEffect(() => {
    if (hasValidUser) {
      axiosSecure
        .get("/admin-dashboard/popular-products")
        .then((res) => setPopularProducts(res.data))
        .catch(() => {});
    }
  }, [hasValidUser]);

  // Recent Reviews
  useEffect(() => {
    if (hasValidUser) {
      axiosSecure
        .get("/admin-dashboard/recent-reviews")
        .then((res) => setRecentReviews(res.data))
        .catch(() => {});
    }
  }, [hasValidUser]);

  return {
    adminStats,
    totalCategories,
    topCategories,
    incomeStats,
    popularProducts,
    recentReviews,
  };
};

export default useAdminStats;
