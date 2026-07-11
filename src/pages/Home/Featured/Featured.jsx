import React, { useEffect, useState } from "react";
import "./Featured.css";
import useProducts from "../../../hooks/useProducts";
import featuredBanner from "../../../assets/featuredbanner.jpg";
import FeaturedCard from "./FeaturedCard/FeaturedCard";
import { Link } from "react-router-dom";
import AnimateText from "@moxy/react-animate-text";

const Featured = () => {
  const [products, isProductsLoading] = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    if (products) {
      /**
       * ********
       * Logics *
       * ********
       *
       * FeaturedProducts: only those products that have the featured key set to true
       *
       * BestSellers: We are sorting the products array based on Sold(a key) value of the products from max to min and slicing the first 4 items.
       */

      setFeaturedProducts(
        products.filter((product) => product.featured === true)
      );

      const sortedArray = [...products].sort((a, b) => b.sold - a.sold);
      setBestSellers(sortedArray.slice(0, 4));
    }
  }, [products]);

  return (
    <div className="container grid grid-cols-1 md:grid-cols-2 md:gap-x-6 gap-y-8 md:gap-y-0 mb-12">
      <div className="h-[450px] relative" data-aos="fade-up">
        <img
          src={featuredBanner}
          className="border w-full h-full hover:scale-[1.01] transition-all duration-150 ease"
        />
        <div
          className="absolute bottom-36 left-8 text-center"
          style={{ fontFamily: "var(--poppins)" }}
        >
          <h5 className="text-lg text-gray-500">BEAUTIFUL</h5>
          <h4
            className="text-4xl font-bold text-black mt-2 mb-6"
            style={{ fontFamily: "var(--italiana)" }}
          >
            <AnimateText initialDelay={0.2} wordDelay={0.2}>
              <span>Wedding Rings</span>
            </AnimateText>
          </h4>

          <Link to="/shop" state={{ category: "diamond rings" }}>
            <button className="border-b-2 border-b-black hover:border-b-[var(--pink-gold)] hover:text-[var(--pink-gold)] transition-all duration-150 ease">
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center md:gap-x-4 space-y-8 md:space-y-0 px-4 md:px-0">
        <div className="md:w-1/2">
          <h4
            className="font-bold text-2xl mb-4"
            style={{ fontFamily: "var(--italiana)" }}
          >
            Featured Products
          </h4>

          {isProductsLoading ? (
            <div className="w-full">
              {[...Array(5)].map((_, idx) => (
                <div
                  className="skeleton w-full h-16 my-4 rounded-none"
                  key={idx}
                ></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {featuredProducts?.map((product, counter) => (
                <FeaturedCard
                  counter={counter}
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2">
          <h4
            className="font-bold text-2xl mb-4"
            style={{ fontFamily: "var(--italiana)" }}
          >
            Best Sellers
          </h4>
          {isProductsLoading ? (
            <div className="w-full">
              {[...Array(5)].map((_, idx) => (
                <div
                  className="skeleton w-full h-16 my-4 rounded-none"
                  key={idx}
                ></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {bestSellers?.map((product) => (
                <FeaturedCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Featured;
