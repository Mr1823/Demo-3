import React from "react";
import "./OtherFeatures.css";
import { LiaShippingFastSolid } from "react-icons/lia";
import { MdOutlinePayment } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

const OtherFeatures = () => {
  return (
    <div
      className="bg-[var(--pink-gold)] grid grid-cols-2 md:grid-cols-4 gap-y-0 gap-x-1 md:gap-x-3 px-1 md:px-16 py-8 mt-32 rounded-t-3xl text-center md:text-left features-container"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <div className="flex flex-col md:flex-row items-center gap-6 md:border-r-2 border-black">
        <LiaShippingFastSolid className="text-6xl" />
        <div>
          <h4 className="text-xl font-bold mb-2 text-black">Free Shipping</h4>
          <p className="text-gray-900">
            Free Shipping across India for orders over ₹5,000
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 md:border-r-2 border-black">
        <BiSupport className="text-6xl" />
        <div>
          <h4 className="text-xl font-bold mb-2 text-black">Online Support</h4>
          <p className="text-gray-900">
            24 hours a day, 7 days a week continuous support
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 md:border-r-2 border-black">
        <svg
          className="text-6xl w-[60px] h-[60px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Circular return arrow */}
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
          {/* Rupee Symbol '₹' centered */}
          <text
            x="50%"
            y="58%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="bold"
            fill="currentColor"
            fontFamily="sans-serif"
          >
            ₹
          </text>
        </svg>
        <div>
          <h4 className="text-xl font-bold mb-2 text-black">Money Guarentee</h4>
          <p className="text-gray-900">
            Replacement within 30 days without any questions
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 ">
        <MdOutlinePayment className="text-6xl" />
        <div>
          <h4 className="text-xl font-bold mb-2 text-black">
            Flexible Payment
          </h4>
          <p className="text-gray-900">
            Pay with multiple credit cards without any problems
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtherFeatures;
