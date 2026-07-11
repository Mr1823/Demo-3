import React from "react";
import "./ProductPageNavigation.css";
import { NavLink, useParams } from "react-router-dom";

const ProductPageNavigation = () => {
  const { id } = useParams();
  return (
    <div className="relative">
      <div
        className="product-navbar border-gray-200 flex items-center gap-7 container font-bold"
        style={{ fontFamily: "var(--italiana)" }}
      >
        <NavLink
          to={`/products/${id}/description`}
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
          }
        >
          Description
        </NavLink>

        <NavLink
          to={`/products/${id}/reviews`}
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
          }
        >
          Reviews
        </NavLink>
      </div>
      <div className="divider h-[2px] absolute -bottom-4 left-0 right-0"></div>
    </div>
  );
};

export default ProductPageNavigation;
