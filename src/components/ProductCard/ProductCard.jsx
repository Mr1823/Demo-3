import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import useDynamicRating from "../../hooks/useDynamicRating";
import StarRatings from "react-star-ratings";
import { FaRegHeart, FaRegEye, FaHeart, FaPen } from "react-icons/fa6";
import { FaShoppingCart, FaCheckDouble } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import useUserInfo from "../../hooks/useUserInfo";
import { TfiClose } from "react-icons/tfi";
import { useMediaQuery } from "react-responsive";

const ProductCard = ({ cardData, flashSale, counter }) => {
  const { user, isAuthLoading } = useAuthContext();
  const [userFromDB] = useUserInfo();
  const { cartData, isCartLoading, addToCart } = useCart();
  const [wishlistData, , , addToWishlist] = useWishlist();
  const [presentInCart, setPresentInCart] = useState(false);
  const [presentInWishlist, setPresentInWishlist] = useState(false);

  // check if item already exist in cart and wishlist
  useEffect(() => {
    if (!isAuthLoading && user?.uid) {
      const itemInCart = cartData?.find((p) => p.productId === cardData._id);
      const itemInWishlist = wishlistData?.find(
        (p) => p.productId === cardData._id
      );

      itemInCart ? setPresentInCart(true) : setPresentInCart(false);
      itemInWishlist ? setPresentInWishlist(true) : setPresentInWishlist(false);
    } else {
      setPresentInCart(false);
      setPresentInWishlist(false);
    }
  }, [
    cartData,
    isCartLoading,
    cardData._id,
    wishlistData,
    user,
    isAuthLoading,
  ]);

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
  } = cardData;

  const { averageRating } = useDynamicRating(review);

  // add to cart function
  const handleAddToCartWishlist = (where) => {
    if (user) {
      if (where === "cart") {
        addToCart(cardData);
      } else {
        addToWishlist(cardData);
      }
    } else {
      // show modal to login if not logged in
      document.getElementById("loginModalTextContent").innerText =
        "to add products into Cart or Wishlist.";
      document.getElementById("takeToLoginModal").showModal();
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 480 });
  const shopRoute = useLocation().pathname.toLowerCase().includes("shop");

  return (
    <div
      className={`${
        flashSale
          ? "w-[270px]"
          : isMobile && shopRoute
          ? "w-[200px]"
          : "w-full max-w-[330px]"
      } product-card mx-auto rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100`}
      style={{ fontFamily: "var(--poppins)" }}
      data-aos="fade-up"
      data-aos-delay={counter && `${counter * 200}`}
    >
      <div className="relative overflow-hidden rounded-t-lg bg-[#ebebed] aspect-[4/5] flex items-center justify-center">
        <Link to={`/products/${_id}/description`} state={{ from: "/" }} className="absolute inset-0 z-10">
          <div className="product-img-overlay w-full h-full rounded-t-lg"></div>
        </Link>
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover rounded-t-lg product-img mix-blend-multiply"
        />

        <div>
          {discountPercentage && (
            <div className="badge badge-error rounded-full py-3 absolute top-3 left-3">
              <h6 className="text-white text-xs">-{discountPercentage}%</h6>
            </div>
          )}

          {badge && (
            <div
              className={`badge bg-[red] rounded-full py-3 absolute ${
                discountPercentage ? "top-10" : "top-3"
              } left-3 font-bold`}
            >
              <h6 className="text-white text-xs uppercase">{badge}</h6>
            </div>
          )}
        </div>

        {/* icons */}
        <div className="absolute top-3 right-3 space-y-3">
          <button
            className={`heart-icon-con tooltip tooltip-left block`}
            data-tip={
              presentInWishlist ? "Added to Wishlist" : "Add to Wishlist"
            }
            onClick={() => handleAddToCartWishlist("wishlist")}
            disabled={presentInWishlist}
          >
            {presentInWishlist ? (
              <FaHeart className="text-xl text-[var(--light-pink)]" />
            ) : (
              <FaRegHeart className="text-xl text-gray-600" />
            )}
          </button>

          <Link
            to={{
              pathname: `/products/${_id}/description`,
            }}
            className="eye-icon-con tooltip tooltip-left block"
            data-tip="View Details"
            state={{ from: "/" }}
          >
            <FaRegEye className="text-xl text-gray-600" />
          </Link>

          {userFromDB?.admin && (
            <Link
              to={{
                pathname: `/dashboard/adminAddProducts`,
              }}
              className="edit-icon-con tooltip tooltip-left block"
              data-tip="Edit Product"
              state={{ from: "/", id: _id }}
            >
              <FaPen className="text-xl text-gray-600" />
            </Link>
          )}
        </div>

        <button
          className="add-to-cart-con absolute bottom-0 left-0 right-0 w-full bg-black text-white flex justify-center gap-2 py-2 rounded-b-lg"
          onClick={() => handleAddToCartWishlist("cart")}
          disabled={presentInCart || stock === 0}
        >
          {stock ? (
            <>
              {presentInCart ? <FaCheckDouble /> : <FaShoppingCart />}

              <p className="text-sm">
                {presentInCart ? "Added to Cart" : "Add to Cart"}
              </p>
            </>
          ) : (
            <>
              <TfiClose />
              <p className="text-sm">Out of Stock</p>
            </>
          )}
        </button>
      </div>
      <div className="mt-2 product-text">
        <Link
          to={`/products/${_id}/description`}
          className="md:text-lg font-bold text-[#3b3b3b]"
          state={{ from: "/" }}
        >
          {name}
        </Link>
        <p className="text-gray-600 mt-1 mb-3">{category}</p>
        <div className="flex items-baseline justify-start gap-3">
          <h4 className="md:text-lg font-bold mb-2">
            ${discountPrice || price}
          </h4>
          {discountPrice && (
            <h5 className="text-base text-gray-400 line-through">{price}</h5>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <StarRatings
            rating={averageRating}
            starDimension="20px"
            starSpacing="4px"
            starRatedColor="#d4647c"
            starEmptyColor="#c7c7c7"
            svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
            svgIconViewBox="0 0 24 24"
          />
          <p className="text-gray-500">
            {review?.length && `(${review?.length} reviews)`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
