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

  // countdown timer values (dynamically active 3 days ahead)
  const [targetDate] = useState(() => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));

  // slick slider settings
  const sliderRef = useRef(null);

  const next = () => {
    sliderRef.current.slickNext();
  };
  const prev = () => {
    sliderRef.current.slickPrev();
  };

  const settings = {
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
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
      className="mt-6 mb-12 container shadow-xl shadow-gray-300 rounded-xl flex flex-col md:flex-row border items-center py-8 px-4 md:px-8 gap-8"
    >
      <div
        className="w-full md:w-[35%] text-center px-2 md:px-6"
        style={{ fontFamily: "var(--montserrat)" }}
      >
        <img
          src={flashSaleIcon}
          alt="flash sale icon"
          className="w-[60%] md:w-[70%] block mx-auto"
        />
        <h4
          className="mt-6 font-bold text-2xl md:text-3xl text-black"
          style={{ fontFamily: "var(--italiana)" }}
        >
          Flash Sale Going On!
        </h4>
        <p className="mt-3 text-gray-500 text-sm md:text-base font-medium">
          🌟 Ready, set, shop! Flash Sale Going On! So Hurry, dive into the
          excitement, and let the savings party begin!💸🚀
        </p>

        <CountDownTimer targetDate={targetDate} />
      </div>

      {isProductsLoading ? (
        <div className="mx-auto flex flex-col md:flex-row items-center gap-4 w-full justify-center">
          {[...Array(isMobile ? 1 : 3)].map((item, idx) => (
            <CardSkeleton key={idx} height={"280px"} width={"270px"} />
          ))}
        </div>
      ) : (
        <div className="w-full md:w-[65%] px-6 md:px-10 relative">
          <Slider ref={sliderRef} {...settings}>
            {flashSaleData?.map((cardData, idx) => (
              <div key={idx + 1} className="px-2">
                <ProductCard cardData={cardData} flashSale={true} />
              </div>
            ))}
          </Slider>
          <button
            aria-label="Next Slide"
            className="absolute top-1/2 -right-1 md:-right-4 -translate-y-1/2 bg-[#f8da2e] rounded-full p-3 md:p-4 shadow-md active:scale-95 hover:bg-yellow-400 transition-all z-10"
            onClick={next}
          >
            <FaArrowRight className="text-black text-sm md:text-base" />
          </button>
          <button
            aria-label="Previous Slide"
            className="absolute top-1/2 -left-1 md:-left-4 -translate-y-1/2 bg-[#f8da2e] rounded-full p-3 md:p-4 shadow-md active:scale-95 hover:bg-yellow-400 transition-all z-10"
            onClick={prev}
          >
            <FaArrowLeft className="text-black text-sm md:text-base" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashSale;
