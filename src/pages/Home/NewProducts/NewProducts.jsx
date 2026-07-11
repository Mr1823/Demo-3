import React, { useEffect, useState } from "react";
import "./NewProducts.css";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import ProductCard from "../../../components/ProductCard/ProductCard";
import useProducts from "../../../hooks/useProducts";
import CardSkeleton from "../../../components/CardSkeleton/CardSkeleton";
import { Link } from "react-router-dom";

const NewProducts = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [products, isProductsLoading] = useProducts();

  useEffect(() => {
    // filter only new products from all products
    const filteredNewProducts = products?.filter(
      (product) => product.newArrival === true
    );

    filteredNewProducts?.sort(
      (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
    );

    setNewProducts(filteredNewProducts?.slice(0, 6));
  }, [products]);

  return (
    <section className="mb-12 pt-4">
      <SectionTitle title={"New Arrivals"} />

      {isProductsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-16 gap-y-10 mt-8 mb-10 w-fit mx-auto">
          {/* iterate empty array of length 6 */}
          {[...Array(6)].map((_, idx) => (
            <CardSkeleton key={idx} height={"350px"} width={"330px"} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-16 gap-y-10 md:gap-y-12 mt-8 mb-10 w-fit mx-auto">
            {newProducts?.map((product, counter) => (
              <ProductCard
                counter={counter}
                key={product._id}
                cardData={product}
              />
            ))}
          </div>

          <Link to="/shop">
            <button className="btn btn-outline mx-auto block btn-wide">
              View all items
            </button>
          </Link>
        </>
      )}
    </section>
  );
};

export default NewProducts;
