import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import ProductCard from "../../components/ProductCard/ProductCard";

const RelatedDynamicProducts = () => {
  const { id } = useParams();
  const [products] = useProducts();
  const [relatedProducts, setRelatedProducts] = useState(null);

  useEffect(() => {
    const dynamicProduct = products?.find((p) => p._id === id);
    const sameCategoryProducts = products?.filter(
      (p) => p.category === dynamicProduct?.category && p._id !== id
    );
    // Limit to 4 related products for the grid layout
    setRelatedProducts(sameCategoryProducts?.slice(0, 4));
  }, [products, id]);

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="py-24 max-w-container-max mx-auto px-margin-desktop border-t border-outline-variant/30 mt-16 w-full">
      <div className="flex flex-col items-center mb-16">
        <div className="w-16 h-[1px] bg-primary mb-6"></div>
        <h2 className="font-display-lg text-headline-md text-primary text-center">You May Also Like</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {relatedProducts?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedDynamicProducts;
