import React from "react";
import useAuthContext from "../../hooks/useAuthContext";
import useUserInfo from "../../hooks/useUserInfo";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, isAuthLoading } = useAuthContext();
  const [userFromDB, isUserLoading] = useUserInfo();

  if (isAuthLoading || isUserLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-neutral"></span>
      </div>
    );
  }

  if (user && userFromDB?.admin) {
    return children;
  }

  return <Navigate to={"/"} />;
};

export default AdminRoute;
