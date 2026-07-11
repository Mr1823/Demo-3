import React from "react";
import ProductPageNavigation from "../pages/DynamicProduct/ProductPageNavigation/ProductPageNavigation";
import { Outlet } from "react-router-dom";
import DynamicProduct from "../pages/DynamicProduct/DynamicProduct";
import RelatedDynamicProducts from "../pages/RelatedDynamicProducts/RelatedDynamicProducts";

const ProductPageLayout = () => {
  return (
    <div className="container" style={{ fontFamily: "var(--poppins)" }}>
      <DynamicProduct />
      <ProductPageNavigation />
      <Outlet />
      <RelatedDynamicProducts />
    </div>
  );
};

export default ProductPageLayout;
