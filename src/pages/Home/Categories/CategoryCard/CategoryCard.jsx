import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const { categoryName, categoryPic } = category;

  return (
    <Link to={`/shop`} state={{ category: categoryName }} data-aos="fade-up">
      <div className="text-center mt-3 p-2">
        <img
          src={categoryPic}
          alt={categoryName}
          className="block mx-auto rounded-full aspect-square w-[160px] h-[160px] object-cover hover:scale-105 cursor-pointer transition-all duration-200 ease-out bg-[#f6f6f6] shadow-md border-2 border-amber-100/50"
        />
        <h1 className="font-[600] text-base md:text-lg mt-3 text-black" style={{ fontFamily: "var(--lato)" }}>
          {categoryName}
        </h1>
      </div>
    </Link>
  );
};

export default CategoryCard;
