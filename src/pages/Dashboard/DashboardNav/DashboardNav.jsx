import React from "react";
import { NavLink } from "react-router-dom";
import useAuthContext from "../../../hooks/useAuthContext";

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
    <nav className="flex flex-col gap-4 sticky top-32">
      <span className="font-body text-[12px] font-semibold text-on-surface-variant mb-4 uppercase tracking-[0.15em]">
        Account Dashboard
      </span>
      
      <NavLink
        to={"/dashboard/myDashboard"}
        className={({ isActive }) =>
          `relative py-2 transition-all text-sm font-body ${
            isActive 
              ? "text-primary font-semibold after:content-[''] after:absolute after:right-0 after:top-[20%] after:h-[60%] after:w-[2px] after:bg-primary" 
              : "text-on-surface-variant hover:text-primary"
          }`
        }
      >
        Overview
      </NavLink>
      
      <NavLink
        to={"/dashboard/myOrders"}
        className={({ isActive }) =>
          `relative py-2 transition-all text-sm font-body ${
            isActive 
              ? "text-primary font-semibold after:content-[''] after:absolute after:right-0 after:top-[20%] after:h-[60%] after:w-[2px] after:bg-primary" 
              : "text-on-surface-variant hover:text-primary"
          }`
        }
      >
        My Orders
      </NavLink>
      
      <NavLink
        to={"/dashboard/myAddress"}
        className={({ isActive }) =>
          `relative py-2 transition-all text-sm font-body ${
            isActive 
              ? "text-primary font-semibold after:content-[''] after:absolute after:right-0 after:top-[20%] after:h-[60%] after:w-[2px] after:bg-primary" 
              : "text-on-surface-variant hover:text-primary"
          }`
        }
      >
        Shipping Addresses
      </NavLink>

      <NavLink
        to={"/dashboard/addReview"}
        className={({ isActive }) =>
          `relative py-2 transition-all text-sm font-body ${
            isActive 
              ? "text-primary font-semibold after:content-[''] after:absolute after:right-0 after:top-[20%] after:h-[60%] after:w-[2px] after:bg-primary" 
              : "text-on-surface-variant hover:text-primary"
          }`
        }
      >
        Add Review
      </NavLink>

      <div className="mt-8 pt-8 border-t border-outline-variant/30">
        <button 
          onClick={handleLogOut}
          className="flex items-center gap-3 text-error font-body text-sm font-semibold uppercase tracking-widest hover:text-error/80 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span> Log Out
        </button>
      </div>
    </nav>
  );
};

export default DashboardNav;
