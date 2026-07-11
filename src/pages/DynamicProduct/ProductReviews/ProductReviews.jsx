import React, { useEffect, useState } from "react";
import "./ProductReviews.css";
import { useLocation, useParams } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import useDynamicRating from "../../../hooks/useDynamicRating";
import StarRatings from "react-star-ratings";
import { IoHeartCircleOutline, IoHeartCircleSharp } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";
import useAuthContext from "../../../hooks/useAuthContext";
import useUserInfo from "../../../hooks/useUserInfo";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import TimeAgo from "../../../components/TimeAgo/TimeAgo";

const ProductReviews = () => {
  const { id } = useParams();
  const { user, isAuthLoading } = useAuthContext();
  const [userFromDB] = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const [products, , refetch] = useProducts();
  const [dynamicProduct, setDynamicProduct] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewsLength, setReviewsLength] = useState(1); // for showing limited reviews in the page
  const location = useLocation();
  const [productReviewError, setProductReviewError] = useState("");
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const { averageRating } = useDynamicRating(dynamicProduct?.review);
  const [updateLikeLoading, setUpdateLikeLoading] = useState(false);

  // fetch dynamic product data
  useEffect(() => {
    const dynamicProduct = products.find((p) => p._id === id);
    setDynamicProduct(dynamicProduct);
  }, [id, products]);

  // check if user already reviewed or not
  useEffect(() => {
    if (user) {
      const reviewFound = dynamicProduct?.review?.find((r) => {
        if (r.email) {
          return r.reviewerEmail === user?.email;
        } else {
          return r.reviewerName === userFromDB?.name;
        }
      });

      setHasUserReviewed(reviewFound ? true : false);
    }
  }, [dynamicProduct, user, userFromDB]);

  // show reviews conditionally
  const handleShowReviews = () => {
    setShowAllReviews(!showAllReviews);
  };
  useEffect(() => {
    if (!showAllReviews) {
      setReviewsLength(2);
    } else {
      setReviewsLength(dynamicProduct?.review?.length);
    }
  }, [showAllReviews, dynamicProduct?.review?.length]);

  // data to show in dynamic star ratings
  const [starRating, setStarRating] = useState(0);
  const handleRatingChange = (newRating) => {
    setStarRating(newRating);
  };

  const handleSubmitProductReview = (e) => {
    e.preventDefault();
    setProductReviewError("");

    if (!starRating) {
      setProductReviewError("Rating value is required");
      return;
    }

    const form = e.target;
    const reviewTitle = form.reviewTitle.value;
    const reviewDesc = form.reviewDesc.value;
    const _id = uuidv4();

    // post review to specific product reviews data
    if (_id) {
      axiosSecure
        .post(`/products/add-review/${dynamicProduct?._id}`, {
          _id,
          reviewerName: userFromDB?.name,
          reviewerEmail: user?.email,
          reviewerImg: user?.photoURL,
          rating: parseFloat(starRating),
          title: reviewTitle,
          desc: reviewDesc,
        })
        .then((res) => {
          if (res.data.modifiedCount > 0) {
            toast.success("Review Added", { position: "bottom-right" });
            form.reset();
            setStarRating(0);
            setProductReviewError("");
          }
          refetch();
        })
        .catch((e) => setProductReviewError(e));
    }
  };

  // delete/update specific product review
  const deleteProductReview = () => {
    axiosSecure
      .delete(
        `/products/delete-review/${dynamicProduct?._id}/reviewer-email/${user?.email}`
      )
      .then(() => {
        refetch();
      })
      .catch((e) => console.error(e));
  };

  // UPDATE PRODUCT LIKE STATUS
  const handleLikeStatus = (reviewObjId) => {
    setUpdateLikeLoading({ status: true, id: reviewObjId });

    if (!isAuthLoading && user?.uid !== undefined) {
      axiosSecure
        .post("/single-product-like-update", {
          productId: id,
          reviewId: reviewObjId,
          email: user?.email,
        })
        .then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
            setUpdateLikeLoading({ status: false });
          }
        })
        .catch((error) => {
          console.error(error);
          setUpdateLikeLoading({ status: false });
        });
    } else {
      document.getElementById("loginModalTextContent").innerText =
        "to give reaction";
      document.getElementById("takeToLoginModal").showModal();
      setUpdateLikeLoading({ status: false });
    }
  };

  return (
    <div className="mt-7 mb-32 px-3" id="productReviews">
      <div className="border-2 rounded-xl border-[var(--pink-gold)] flex flex-col items-center p-8 md:w-[40%] space-y-5 mx-auto">
        <h1 className="text-6xl font-extrabold text-black">{averageRating}</h1>
        <StarRatings
          rating={averageRating}
          starDimension="28px"
          starSpacing="4px"
          starRatedColor="#d4647c"
          starEmptyColor="#c7c7c7"
          svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
          svgIconViewBox="0 0 24 24"
        />
        <p className="text-gray-600 text-lg">Product Rating</p>
      </div>

      {dynamicProduct?.review?.length > 0 && (
        <div>
          <h4
            className="text-2xl font-bold mb-10 mt-16"
            style={{ fontFamily: "var(--poppins)" }}
          >
            CUSTOMERS FEEDBACK
          </h4>

          <div className="md:pl-10 md:pr-20 product-reviews-con">
            {dynamicProduct?.review
              ?.slice(0, reviewsLength)
              .sort((a, b) => b.reviewDate.localeCompare(a.reviewDate))
              .map((r) => (
                <div key={r._id} className="flex items-start gap-4 ">
                  <div className="avatar">
                    <div className="mask mask-circle w-12 h-12">
                      <img src={r.reviewerImg} alt={r.reviewerName} />
                    </div>
                  </div>

                  <div className="md:w-[95%]">
                    <div className="flex items-center gap-4">
                      <h5 className="text-xl text-black font-semibold">
                        {r.reviewerName}
                      </h5>

                      {/* User friendly Review Date */}
                      <p className="text-sm text-gray-600">
                        <TimeAgo timeStamp={r.reviewDate} />
                      </p>

                      {user && user?.email === r.reviewerEmail && (
                        <CiEdit
                          className="text-xl text-black"
                          onClick={deleteProductReview}
                        />
                      )}
                    </div>
                    <StarRatings
                      rating={r.rating}
                      starDimension="16px"
                      starSpacing="3px"
                      starRatedColor="#d4647c"
                      starEmptyColor="#c7c7c7"
                      svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
                      svgIconViewBox="0 0 24 24"
                    />

                    <div className="mt-4 space-y-2">
                      <h5 className="text-lg text-black">{r.title}</h5>
                      <p className="text-gray-600">{r.desc}</p>
                    </div>

                    <button
                      className="flex gap-1 mt-5 text-gray-700 cursor-pointer transition-all duration-300"
                      onClick={() => handleLikeStatus(r._id)}
                      disabled={updateLikeLoading?.status}
                    >
                      {r.likedBy?.includes(user?.email) ? (
                        <IoHeartCircleSharp className="text-[var(--light-pink)] text-2xl" />
                      ) : (
                        <IoHeartCircleOutline className="text-2xl" />
                      )}

                      {updateLikeLoading?.status &&
                      updateLikeLoading?.id === r._id ? (
                        <span className="loading loading-ring block mt-[2px]"></span>
                      ) : (
                        <span>
                          {r.likeCount > 0 ? (
                            <span className="font-bold mt-[2px] block">
                              {r.likeCount}
                            </span>
                          ) : (
                            <span className="mt-[2px] block">Like</span>
                          )}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <button
            onClick={handleShowReviews}
            className={`mx-auto block border-b-2 border-b-black ${
              dynamicProduct?.review?.length <= 2 && "hidden"
            }`}
          >
            {showAllReviews ? "Show Less" : "View All Reviews"}
          </button>
        </div>
      )}

      <div className="mt-16">
        {!user?.uid ? (
          <div>
            <h4 className="font-bold text-2xl uppercase mb-4">
              Write a Review
            </h4>
            <p>
              You must be{" "}
              <Link
                to="/login"
                className="text-primary"
                state={{ from: location }}
              >
                logged in
              </Link>{" "}
              to write a review.
            </p>
          </div>
        ) : (
          <>
            {!hasUserReviewed && (
              <div>
                <h4 className="font-bold text-2xl uppercase">Write a Review</h4>
                <form
                  onSubmit={handleSubmitProductReview}
                  className="mt-8 px-2 space-y-8"
                >
                  {productReviewError && (
                    <p className="text-error">{productReviewError}</p>
                  )}
                  <div className="space-y-2">
                    <h5 className="font-bold">
                      What would you rate the product?
                    </h5>
                    <StarRatings
                      rating={starRating}
                      starRatedColor="#d4647c"
                      starHoverColor="#d4647c"
                      starEmptyColor="#c7c7c7"
                      changeRating={handleRatingChange}
                      numberOfStars={5}
                      starDimension="22px"
                      starSpacing="4px"
                      required="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold">Review Title</h5>
                    <textarea
                      rows={1}
                      required
                      name="reviewTitle"
                      placeholder="Great Product"
                      className="outline-none border-2 border-black rounded-lg w-full p-3"
                      minLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold">Review Content</h5>
                    <textarea
                      rows={5}
                      required
                      name="reviewDesc"
                      placeholder="Write a detailed review about what you liked about the product ..."
                      className="outline-none border-2 border-black rounded-lg w-full p-3"
                      minLength={20}
                    />
                  </div>

                  <button className="btn btn-outline btn-neutral btn-wide border-2">
                    Submit
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
