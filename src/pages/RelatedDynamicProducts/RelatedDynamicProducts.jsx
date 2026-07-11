import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import Slider from "react-slick";
import ProductCard from "../../components/ProductCard/ProductCard";

const RelatedDynamicProducts = () => {
  const { id } = useParams();
  const [products] = useProducts();
  const [relatedProducts, setRelatedProducts] = useState(null);

  useEffect(() => {
    const dynamicProduct = products?.find((p) => p._id === id);
    const sameCategoryProducts = products?.filter(
      (p) => p.category === dynamicProduct?.category
    );
    setRelatedProducts(sameCategoryProducts);
  }, [products, id]);

  //   react slick props
  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slideToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slideToScroll: 1,
          swipeToSlide: true,
        },
      },
    ],
  };

  return (
    <div className="my-20 space-y-16">
      <SectionTitle title={"Related Products"} />
      <Slider {...settings} className="pb-8">
        {relatedProducts?.map((product) => (
          <ProductCard key={product._id} cardData={product} />
        ))}
      </Slider>
    </div>
  );
};

export default RelatedDynamicProducts;
