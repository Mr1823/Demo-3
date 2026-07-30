import React from "react";
import ProductPageNavigation from "../pages/DynamicProduct/ProductPageNavigation/ProductPageNavigation";
import { Outlet } from "react-router-dom";
import DynamicProduct from "../pages/DynamicProduct/DynamicProduct";
import RelatedDynamicProducts from "../pages/RelatedDynamicProducts/RelatedDynamicProducts";
import Header from "../pages/Header/Header";
import Footer from "../pages/Footer/Footer";

const ProductPageLayout = () => {
  return (
    <div className="font-body-base bg-background text-on-surface min-h-screen w-full flex flex-col">
      <Header />
      <DynamicProduct />
      
      <div className="w-full bg-surface-container-low/30 border-t border-outline-variant/30">
        <ProductPageNavigation />
      </div>
      
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <Outlet />
      </div>
      
      <RelatedDynamicProducts />
      <Footer />
    </div>
  );
};

export default ProductPageLayout;
