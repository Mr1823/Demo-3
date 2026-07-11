import React from "react";
import { Link } from "react-router-dom";

const FeaturedCard = ({ product, counter }) => {
  const { _id, img, name, price, discountPrice } = product;
  return (
    <Link
      to={`/products/${_id}/description`}
      state={{ from: "/" }}
      className="block"
    >
      <div
        className="h-[90px] flex justify-start items-center gap-3 pr-2 cursor-pointer"
        style={{ fontFamily: "var(--poppins)" }}
        data-aos="fade-up"
        data-aos-delay={`${counter * 200}`}
      >
        <img
          src={img}
          alt={name}
          className="h-full bg-[#ebebed] w-[30%] object-cover rounded-md mix-blend-multiply"
        />
        <div className="w-[70%] space-y-2">
          <h5 className="hover:text-[var(--pink-gold)] transition-all duration-200 ease-out">
            {name}
          </h5>
          <div className="flex items-center gap-4">
            <h5 className="text-slate-600">₹{price}</h5>
            {discountPrice && (
              <h6 className="line-through text-gray-300">{discountPrice}</h6>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
