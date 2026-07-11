import React from "react";
import useProducts from "./useProducts";

const useFilterProducts = () => {
  const [products] = useProducts();

  const getUniqueProducts = (filterKey) => {
    let counts = { All: 0 };
    for (let i = 0; i < products?.length; i++) {
      const objKey = products[i][filterKey];
      counts[objKey] = (counts[objKey] || 0) + 1;
      counts.All += 1;
    }
    return Object.entries(counts).map(([key, value]) => ({ [key]: value }));
  };

  return { allProducts: products, getUniqueProducts };
};

export default useFilterProducts;
