import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import useUserInfo from "../../hooks/useUserInfo";
import StarRatings from "react-star-ratings";
import useDynamicRating from "../../hooks/useDynamicRating";

const ProductCard = ({ cardData, counter }) => {
  const { user, isAuthLoading } = useAuthContext();
  const [userFromDB] = useUserInfo();
  const { cartData, isCartLoading, addToCart } = useCart();
  const [wishlistData, , , addToWishlist] = useWishlist();
  const [presentInCart, setPresentInCart] = useState(false);
  const [presentInWishlist, setPresentInWishlist] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && user) {
      const itemInCart = cartData?.find((p) => p.productId === cardData._id);
      const itemInWishlist = wishlistData?.find(
        (p) => p.productId === cardData._id
      );
      setPresentInCart(!!itemInCart);
      setPresentInWishlist(!!itemInWishlist);
    } else {
      setPresentInCart(false);
      setPresentInWishlist(false);
    }
  }, [cartData, isCartLoading, cardData._id, wishlistData, user, isAuthLoading]);

  const {
    _id,
    name,
    img,
    category,
    price,
    review,
    discountPrice,
    discountPercentage,
    badge,
    stock,
    carate,
  } = cardData;

  const { averageRating } = useDynamicRating(review);

  const handleAddToCartWishlist = (e, where) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      if (where === "cart") {
        addToCart(cardData);
      } else {
        addToWishlist(cardData);
      }
    } else {
      document.getElementById("loginModalTextContent").innerText =
        "to add products into Cart or Wishlist.";
      document.getElementById("takeToLoginModal").showModal();
    }
  };

  return (
    <article 
      className="group flex flex-col gap-5 cursor-pointer relative"
    >
      <Link to={`/products/${_id}/description`} state={{ from: "/" }} className="absolute inset-0 z-0"></Link>
      
      <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden border border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 transition-colors duration-500 rounded-sm">
        <img 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          src={img} 
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
          {discountPercentage && (
            <div className="bg-[#93000a] text-white font-label-caps text-[10px] font-bold px-2 py-1 rounded-sm tracking-widest">
              -{discountPercentage}%
            </div>
          )}
          {badge && (
            <div className="bg-[#353026] text-white font-label-caps text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
              {badge}
            </div>
          )}
        </div>

        {/* Favorite Icon */}
        <button 
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors z-20 bg-white/60 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-300"
          onClick={(e) => handleAddToCartWishlist(e, "wishlist")}
          disabled={presentInWishlist}
          title={presentInWishlist ? "Added to Wishlist" : "Add to Wishlist"}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: presentInWishlist ? "'FILL' 1" : "'FILL' 0", color: presentInWishlist ? "#93000a" : "inherit" }}>
            favorite_border
          </span>
        </button>

        {/* Edit Product (Admin) */}
        {userFromDB?.admin && (
          <div className="absolute top-16 right-4 z-20">
            <Link
              to={{ pathname: `/dashboard/adminAddProducts` }}
              state={{ from: "/", id: _id }}
              className="text-on-surface-variant hover:text-primary transition-colors bg-white/60 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-300 shadow-sm flex items-center justify-center"
              title="Edit Product"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </Link>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
            <span className="bg-white/90 text-black px-4 py-2 font-label-caps text-xs tracking-widest uppercase rounded-sm">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center text-center gap-2 z-20">
        <span className="font-label-caps text-[10px] text-outline uppercase tracking-widest line-clamp-1">
          {carate ? `${carate}K ` : ""}{category}
        </span>
        <h3 className="font-display-lg text-[22px] text-on-background leading-tight line-clamp-1">
          {name}
        </h3>
        
        <div className="flex items-center gap-3 mt-1 min-h-[24px]">
          {cardData.isQuoteOnly ? (
            <span className="font-body-base text-[16px] text-primary italic font-medium">Price on Request</span>
          ) : (
            <>
              <span className="font-body-base text-[16px] text-primary font-medium">
                ₹{discountPrice || price}
              </span>
              {discountPrice && (
                <span className="text-sm text-outline-variant line-through font-body-base">₹{price}</span>
              )}
            </>
          )}
        </div>

        {review?.length > 0 && (
          <div className="flex items-center justify-center gap-1 mt-1 scale-90 pointer-events-none">
             <StarRatings
              rating={averageRating}
              starDimension="14px"
              starSpacing="1px"
              starRatedColor="#c8a684"
              starEmptyColor="#ebe1d2"
              svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
              svgIconViewBox="0 0 24 24"
            />
            <span className="text-[10px] text-outline-variant ml-1 font-body-base">({review.length})</span>
          </div>
        )}

        {/* Add to Cart or Get Quote Button (Only hoverable because z-20) */}
        {cardData.isQuoteOnly ? (
          <Link 
            to={`/products/${_id}/description`}
            className="mt-2 font-button-text text-button-text text-primary border border-primary/40 px-8 py-2.5 hover:bg-primary hover:text-on-primary transition-all duration-300 rounded-sm w-full md:w-auto z-20"
          >
            Get Quote
          </Link>
        ) : (
          <button 
            className="mt-2 font-button-text text-button-text text-primary border border-primary/40 px-8 py-2.5 hover:bg-primary hover:text-on-primary transition-all duration-300 rounded-sm w-full md:w-auto disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary z-20"
            onClick={(e) => handleAddToCartWishlist(e, "cart")}
            disabled={presentInCart || stock === 0}
          >
            {presentInCart ? "Added to Bag" : "Add to Bag"}
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
