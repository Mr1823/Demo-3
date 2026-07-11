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

  const { data: adminStats } = useQuery({
    enabled:
      !isAuthLoading &&
      user?.uid !== undefined &&
      localStorage.getItem("the-jewel-store-jwt-token") !== null,
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/stats");
      return res.data;
    },
  });

  // TOP SELLING CATEGORIES
  useEffect(() => {
    if (user) {
      // get categories data
      axiosSecure.get("/admin-dashboard/top-selling-categories").then((res) => {
        setTotalCategories(res.data.totalCategories);
        setTopCategories(res.data.topCategories);
      });

      // get income stats for last 5 and current month
      axiosSecure.get("/admin-dashboard/income-stats").then((res) => {
        setIncomeStats(res.data);
      });
    }
  }, [user]);

  // BEST SELLING POPULAR PRODUCTS
  useEffect(() => {
    if (user) {
      axiosSecure
        .get("/admin-dashboard/popular-products")
        .then((res) => setPopularProducts(res.data));
    }
  }, [user]);

  // Recent Reviews
  useEffect(() => {
    if (user) {
      axiosSecure
        .get("/admin-dashboard/recent-reviews")
        .then((res) => setRecentReviews(res.data));
    }
  }, [user]);

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
