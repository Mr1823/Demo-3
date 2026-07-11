import React from "react";
import "./DashboardNav.css";
import { Link } from "react-router-dom";
import useAuthContext from "../../../hooks/useAuthContext";
import { NavLink } from "react-router-dom";

const DashboardNav = () => {
  const { logOut } = useAuthContext();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        // logout successful
      })
      .catch((err) => console.error(err));
  };
  return (
    <nav className="w-full flex flex-row md:flex-col dashboard-nav border-b pr-2 overflow-auto">
      <NavLink
        to={"/dashboard/myDashboard"}
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Account Dashboard
      </NavLink>
      <NavLink
        to={"/dashboard/myOrders"}
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        My Orders
      </NavLink>
      <NavLink
        to={"/dashboard/myAddress"}
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Address Book
      </NavLink>

      <NavLink
        to={"/dashboard/addReview"}
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Add Review
      </NavLink>

      <Link onClick={handleLogOut}>Log Out</Link>
    </nav>
  );
};

export default DashboardNav;
