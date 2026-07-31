import React from "react";
import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import useUserInfo from "../hooks/useUserInfo";

/**
 * Landing target for /dashboard. Admins belong on the admin dashboard —
 * sending them to the customer overview left them looking at "Your Account"
 * underneath the Admin Portal sidebar.
 */
const DashboardIndexRedirect = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [userFromDB, isUserLoading] = useUserInfo();

  if (isAuthLoading || isUserLoading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-neutral"></span>
      </div>
    );
  }

  const isAdmin =
    user?.role === "ADMIN" || userFromDB?.admin || userFromDB?.role === "ADMIN";

  return <Navigate to={isAdmin ? "adminDashboard" : "myDashboard"} replace />;
};

export default DashboardIndexRedirect;
