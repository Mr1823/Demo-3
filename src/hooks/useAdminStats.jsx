import React from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useAdminStats = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const hasValidUser = !isAuthLoading && user !== null && user !== undefined;

  const { data: adminStats } = useQuery({
    enabled: hasValidUser,
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/stats");
      return res.data;
    },
  });

  const { data: revenueStats } = useQuery({
    enabled: hasValidUser,
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/revenue?period=monthly");
      return res.data?.data || [];
    },
  });

  const { data: salesByCategory } = useQuery({
    enabled: hasValidUser,
    queryKey: ["admin-sales-by-category"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/sales-by-category");
      return res.data?.data || [];
    },
  });

  const { data: bestSelling } = useQuery({
    enabled: hasValidUser,
    queryKey: ["admin-best-selling"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/best-selling");
      return res.data?.data || [];
    },
  });

  const { data: mostWishlisted } = useQuery({
    enabled: hasValidUser,
    queryKey: ["admin-most-wishlisted"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/most-wishlisted");
      return res.data?.data || [];
    },
  });

  const { data: incomeStats } = useQuery({
    enabled: hasValidUser,
    queryKey: ["admin-income-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/income-stats");
      return (res.data || []).map((row) => ({
        monthName: row.month,
        income: row.income,
        totalOrders: row.orders,
      }));
    },
  });

  return {
    adminStats,
    incomeStats,
    revenueStats,
    salesByCategory,
    bestSelling,
    mostWishlisted,
  };
};

export default useAdminStats;
