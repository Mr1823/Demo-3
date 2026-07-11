import React, { useEffect, useRef, useState } from "react";
import "./FlashSale.css";
import flashSaleIcon from "../../../assets/flash sale products images/flashSale.png";
import ProductCard from "../../../components/ProductCard/ProductCard";
import CountDownTimer from "../../../components/CountDownTimer/CountDownTimer";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import useProducts from "../../../hooks/useProducts";
import CardSkeleton from "../../../components/CardSkeleton/CardSkeleton";
import { useMediaQuery } from "react-responsive";

const FlashSale = () => {
  const [products, isProductsLoading] = useProducts();
  const [flashSaleData, setFlashSaleData] = useState([]);
  useEffect(() => {
    const filterFlashProducts = products?.filter((p) => p.flashSale === true);
    setFlashSaleData(filterFlashProducts);
  }, [products]);
  const isMobile = useMediaQuery({ maxWidth: 480 });

  // countdown timer values
  const targetDate = new Date(2024, 10, 10, 12, 0, 0, 0);

  // slick slider settings
  const sliderRef = useRef(null);

  const next = () => {
    sliderRef.current.slickNext();
  };
  const prev = () => {
    sliderRef.current.slickPrev();
  };

  const settings = {
    arrow: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div
      id="flashSale"
      className="mt-6 mb-12 container shadow-xl shadow-gray-300 rounded-xl flex flex-col md:flex-row border items-center py-8 gap-8"
    >
      <div
        className="md:w-[30%] text-center px-4 md:px-6"
        style={{ fontFamily: "var(--montserrat)" }}
      >
        <img
          src={flashSaleIcon}
          alt="flash sale icon"
          className="w-[70%] block mx-auto"
        />
        <h4
          className="mt-6 font-bold text-2xl text-black"
          style={{ fontFamily: "var(--italiana)" }}
        >
          Flash Sale Going On!
        </h4>
        <p className="mt-4 text-gray-500 font-medium">
          🌟 Ready, set, shop! Flash Sale Going On! So Hurry, dive into the
          excitement, and let the savings party begin!💸🚀
        </p>

        <CountDownTimer targetDate={targetDate} />
      </div>

      {isProductsLoading ? (
        <div className="mx-auto flex flex-col md:flex-row items-center gap-2">
          {[...Array(isMobile ? 1 : 3)].map((item, idx) => (
            <CardSkeleton key={idx} height={"280px"} width={"270px"} />
          ))}
        </div>
      ) : (
        <div className="w-[80%] md:w-[70%] relative">
          <Slider ref={sliderRef} {...settings}>
            {flashSaleData?.map((cardData, idx) => (
              <ProductCard key={idx + 1} cardData={cardData} flashSale={true} />
            ))}
          </Slider>
          <button
            className="button absolute bottom-1/2 -right-16 translate-x-[-50%] translate-y-[-50%] bg-[#f8da2e] rounded-badge p-5 active:bg-yellow-400 transition-all duration-200"
            onClick={next}
          >
            <FaArrowRight className="" />
          </button>
          <button
            className="md:hidden button absolute bottom-1/2 left-0 translate-x-[-50%] translate-y-[-50%] bg-[#f8da2e] rounded-badge p-5 active:bg-yellow-400 transition-all duration-200"
            onClick={prev}
          >
            <FaArrowLeft className="" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashSale;
