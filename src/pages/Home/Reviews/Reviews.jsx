import React, { useRef } from "react";
import "./Reviews.css";
import { useQuery } from "react-query";
import axios from "axios";
import { getApiBaseUrl } from "../../../utils/apiConfig";
import Slider from "react-slick";
import ReviewCard from "./ReviewCard/ReviewCard";
import { TfiQuoteLeft, TfiQuoteRight } from "react-icons/tfi";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

const Reviews = () => {
  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const apiBaseUrl = getApiBaseUrl();
      const res = await axios.get(`${apiBaseUrl}/reviews`);
      return res.data;
    },
  });

  // react slick slider settings
  const settings = {
    arrows: false,
    infinite: true,
    dots: true,
    dotsClass: "slick-dots reviews-slick-dots",
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const sliderRef = useRef(null);

  const next = () => {
    sliderRef.current.slickNext();
  };
  const previous = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div id="reviews" className="mb-14 pt-4 container">
      <SectionTitle title={"Customers Say"} />
      <div className="w-full md:container relative mt-6">
        {isReviewsLoading ? (
          <div>
            <span className="loading loading-spinner loading-lg block mx-auto my-10"></span>
          </div>
        ) : (
          <Slider {...settings} ref={sliderRef}>
            {reviews?.map((reviewObj) => (
              <ReviewCard key={reviewObj._id} reviewObj={reviewObj} />
            ))}
          </Slider>
        )}

        {/* slider left right buttons */}
        <button
          className="button absolute top-1/2 left-11 md:left-14 -translate-x-1/2 -translate-y-1/2 "
          onClick={previous}
        >
          <svg
            fill="#000000"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[70px] md:w-[170px] h-[50px] md:h-[120px] rotate-180"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path>{" "}
            </g>
          </svg>
        </button>
        <button
          className="button absolute top-1/2 -right-6 md:-right-28 -translate-x-1/2 -translate-y-1/2"
          onClick={next}
        >
          <svg
            fill="#000000"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[70px] md:w-[170px] h-[50px] md:h-[120px]"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path>{" "}
            </g>
          </svg>
        </button>

        {/* quote icons */}

        <TfiQuoteLeft className="text-6xl md:text-9xl absolute -top-10 md:-top-20 left-1 md:left-10 text-gray-300 -z-10" />
        <TfiQuoteRight className="hidden md:block text-6xl md:text-9xl absolute bottom-3 right-2 md:-bottom-[74px] md:right-[38px] text-gray-300 -z-10" />
      </div>
    </div>
  );
};

export default Reviews;
