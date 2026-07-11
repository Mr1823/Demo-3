import React, { useEffect, useState } from "react";
import "./DynmicProduct.css";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import useDynamicRating from "../../hooks/useDynamicRating";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass, FaRegHeart } from "react-icons/fa6";
import { LiaShippingFastSolid } from "react-icons/lia";
import { RiRefund2Line } from "react-icons/ri";
import Magnifier from "react-magnifier";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";
import { HashLink } from "react-router-hash-link";
import useProducts from "../../hooks/useProducts";
import useCart from "../../hooks/useCart";
import useAuthContext from "../../hooks/useAuthContext";
import useWishlist from "../../hooks/useWishlist";
import toast from "react-hot-toast";
import { FiShoppingCart } from "react-icons/fi";

const DynamicProduct = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [dynamicProduct, setDynamicProduct] = useState(null);
  const [presentInCart, setPresentInCart] = useState(false);
  const [presentInWishlist, setPresentInWishlist] = useState(false);
  const [products] = useProducts();
  const { cartData, addToCart } = useCart();
  const [wishlistData, , , addToWishlist] = useWishlist();

  // find the product by id
  useEffect(() => {
    const filteredProduct = products?.find((data) => data._id === id);
    setDynamicProduct(filteredProduct);
  }, [products, id]);

  // check if product is present in cart and wishlist
  useEffect(() => {
    if (user) {
      const cartProduct = cartData?.find(
        (cartItem) => cartItem.productId === id
      );
      setPresentInCart(cartProduct ? true : false);

      const wishlistProduct = wishlistData?.find(
        (wishlistItem) => wishlistItem.productId === id
      );
      setPresentInWishlist(wishlistProduct ? true : false);
    }
  }, [cartData, dynamicProduct, id, wishlistData, user]);

  // set order quantity
  const [quantity, setQuantity] = useState(1);

  // add to cart function
  const handleAddToCartWishlist = (where) => {
    if (user) {
      where === "cart"
        ? addToCart(dynamicProduct, quantity)
        : addToWishlist(dynamicProduct);
    } else {
      // show modal to login if not logged in
      document.getElementById("loginModalTextContent").innerText =
        "to add products into Cart or Wishlist.";
      document.getElementById("takeToLoginModal").showModal();
    }
  };

  // get calculated average rating
  const { averageRating } = useDynamicRating(dynamicProduct?.review);

  return (
    <div className="my-16">
      <CustomHelmet title={"Product Details"} />
      {/* product image and buttons */}
      <div
        className="container flex flex-col md:flex-row md:justify-between items-center px-4 md:px-0"
        style={{ fontFamily: "var(--poppins)" }}
      >
        {/* left side div */}
        <div className="w-full md:w-[40%] relative product-img-con border-2 rounded-xl h-[500px]">
          <div className="h-[100%] flex justify-center items-center">
            {/* product image magnifier */}
            <Magnifier
              src={dynamicProduct?.img}
              mgShape="circle"
              mgShowOverflow={false}
              mgBorderWidth={1}
              zoomFactor={1.2}
            />
          </div>
          <div className="img-zoom-hint opacity-100 visible flex items-center gap-2 bg-gray-50 w-fit px-4 py-3 rounded-full shadow absolute bottom-5 right-5 text-gray-500">
            <FaMagnifyingGlass />
            <p>Zoom On Hover</p>
          </div>
        </div>

        {/* right side div */}
        <div className="w-full md:w-[58%] mt-8 md:mt-0">
          {/* upper part*/}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <h4 className="uppercase font-bold bg-[#eebfab] px-6 py-2 text-sm text-black">
              {dynamicProduct?.category}
            </h4>
            <div className="space-x-4">
              <StarRatings
                rating={averageRating}
                starDimension="24px"
                starSpacing="4px"
                starRatedColor="#d4647c"
                starEmptyColor="#c7c7c7"
                svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
                svgIconViewBox="0 0 24 24"
              />
              <HashLink
                to={`/products/${id}/reviews/#productReviews`}
                smooth
                className="text-gray-400 pt-1 underline"
              >
                {dynamicProduct?.review?.length && (
                  <span>
                    See All Reviews ({dynamicProduct?.review?.length})
                  </span>
                )}
              </HashLink>
            </div>
          </div>
          {/* ---------------------- */}
          {/* middle part*/}
          <div className="mt-6">
            <h1
              className="text-4xl font-bold tracking-wide"
              style={{ fontFamily: "var(--italiana)" }}
            >
              {dynamicProduct?.name}
            </h1>
            <div className="flex items-center mt-8 md:w-[60%] gap-5">
              <div className="w-[35%]">
                <div className="flex items-center justify-between border border-black mt-2 py-2 px-2">
                  <button
                    disabled={quantity === 0}
                    onClick={() => quantity > 0 && setQuantity(quantity - 1)}
                  >
                    <FaMinus />
                  </button>
                  <span className="font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => {
                      dynamicProduct?.stock - quantity > 0
                        ? setQuantity(quantity + 1)
                        : toast.error("Out of Stock", {
                            position: "bottom-right",
                          });
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div>
                <h4 className="mt-2 px-2 font-bold text-3xl py-2">
                  ₹ {dynamicProduct?.price}
                </h4>
              </div>
            </div>
          </div>
          {/* ---------------------- */}
          {/* buttons part */}
          <div className="flex items-center gap-5 mt-6 md:w-[60%]">
            <button
              className="btn rounded-none flex-1 bg-[var(--pink-gold)] font-bold"
              disabled={presentInCart}
              onClick={() => handleAddToCartWishlist("cart")}
            >
              {/* <FaCartShopping /> */}
              <FiShoppingCart className="text-lg" />
              <span>{presentInCart ? "ADDED TO CART" : "ADD TO CART"}</span>
            </button>
            <button
              className="btn rounded-none flex-1 font-bold text-white bg-black hover:text-black"
              disabled={presentInWishlist}
              onClick={() => handleAddToCartWishlist("wishlist")}
            >
              <FaRegHeart />
              SAVE
            </button>
          </div>

          <div className="border-2 rounded-xl px-7 py-6 space-y-4 mt-12 md:w-[70%]">
            <div className="flex items-center gap-5">
              <LiaShippingFastSolid className="text-3xl" />
              <div>
                <h4 className="font-bold">FREE SHIPPING</h4>
                <p className="text-gray-500 text-sm">
                  Free shipping available only for the weekend
                </p>
              </div>
            </div>
            <div className="divider"></div>
            <div className="flex items-center gap-5">
              <RiRefund2Line className="text-3xl" />
              <div>
                <h4 className="font-bold">RETURN DELIVERY</h4>
                <p className="text-gray-500 text-sm">
                  Free 30 days Delivery Return on all products
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* product details and reviews */}
    </div>
  );
};

export default DynamicProduct;
