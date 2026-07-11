import React from "react";
import useAuthContext from "../../hooks/useAuthContext";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, isAuthLoading } = useAuthContext();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
