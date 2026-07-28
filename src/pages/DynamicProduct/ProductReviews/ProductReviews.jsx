import React, { useEffect, useState } from "react";
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

    if (!isAuthLoading && user) {
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
    <div className="py-16 px-4 md:px-12 flex flex-col gap-16 border-b border-outline-variant/30 max-w-4xl mx-auto" id="productReviews">
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-low border border-outline-variant/30 rounded-sm">
        <h1 className="font-display-lg text-6xl text-primary mb-4">{averageRating}</h1>
        <StarRatings
          rating={averageRating}
          starDimension="24px"
          starSpacing="4px"
          starRatedColor="#c8a684"
          starEmptyColor="#ebe1d2"
        />
        <p className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest mt-6">Product Rating</p>
      </div>

      {dynamicProduct?.review?.length > 0 && (
        <div className="space-y-12">
          <h4 className="font-display-lg text-headline-sm text-primary text-center">
            CLIENT FEEDBACK
          </h4>

          <div className="space-y-10">
            {dynamicProduct?.review
              ?.slice(0, reviewsLength)
              .sort((a, b) => b.reviewDate.localeCompare(a.reviewDate))
              .map((r) => (
                <div key={r._id} className="flex items-start gap-6 pb-10 border-b border-outline-variant/20 last:border-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-outline-variant/30">
                    <img src={r.reviewerImg || "https://ui-avatars.com/api/?name="+r.reviewerName} alt={r.reviewerName} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h5 className="font-display-lg text-lg text-primary">
                          {r.reviewerName}
                        </h5>
                        <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
                          <TimeAgo timeStamp={r.reviewDate} />
                        </p>
                      </div>

                      {user && user?.email === r.reviewerEmail && (
                        <button onClick={deleteProductReview} className="text-on-surface-variant hover:text-error transition-colors" title="Delete Review">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      )}
                    </div>
                    
                    <StarRatings
                      rating={r.rating}
                      starDimension="14px"
                      starSpacing="2px"
                      starRatedColor="#c8a684"
                      starEmptyColor="#ebe1d2"
                    />

                    <div className="pt-2">
                      <h5 className="font-display-lg text-lg text-on-surface mb-2">{r.title}</h5>
                      <p className="font-body-base text-on-surface-variant leading-relaxed text-sm">{r.desc}</p>
                    </div>

                    <button
                      className="flex items-center gap-2 mt-4 text-xs font-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
                      onClick={() => handleLikeStatus(r._id)}
                      disabled={updateLikeLoading?.status}
                    >
                      {r.likedBy?.includes(user?.email) ? (
                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      ) : (
                        <span className="material-symbols-outlined text-sm">favorite</span>
                      )}

                      {updateLikeLoading?.status && updateLikeLoading?.id === r._id ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        <span>
                          {r.likeCount > 0 ? (
                            <span>{r.likeCount} Helpful</span>
                          ) : (
                            <span>Helpful</span>
                          )}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
          
          {dynamicProduct?.review?.length > 2 && (
            <button
              onClick={handleShowReviews}
              className="mx-auto flex items-center justify-center gap-2 font-label-caps text-xs text-primary uppercase tracking-widest hover:bg-primary/5 px-6 py-3 border border-primary/20 transition-colors rounded-sm"
            >
              {showAllReviews ? "Show Less" : "View All Reviews"}
            </button>
          )}
        </div>
      )}

      <div className="pt-8 mt-8 border-t border-outline-variant/30">
        {!user ? (
          <div className="text-center bg-surface-container-low p-10 border border-outline-variant/30">
            <h4 className="font-display-lg text-headline-sm text-primary mb-4">
              Write a Review
            </h4>
            <p className="font-body-base text-on-surface-variant">
              You must be{" "}
              <Link
                to="/login"
                className="text-primary font-bold border-b border-primary/30 hover:border-primary transition-colors"
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
              <div className="bg-surface-container-low p-8 md:p-12 border border-outline-variant/30 rounded-sm">
                <h4 className="font-display-lg text-headline-sm text-primary mb-8 text-center">Share Your Experience</h4>
                <form
                  onSubmit={handleSubmitProductReview}
                  className="space-y-8 max-w-2xl mx-auto"
                >
                  {productReviewError && (
                    <p className="text-error font-body-base text-sm bg-error-container text-on-error-container p-4 rounded-sm">{productReviewError}</p>
                  )}
                  
                  <div className="space-y-3 flex flex-col items-center">
                    <h5 className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">
                      Rate this product
                    </h5>
                    <StarRatings
                      rating={starRating}
                      starRatedColor="#c8a684"
                      starHoverColor="#c8a684"
                      starEmptyColor="#ebe1d2"
                      changeRating={handleRatingChange}
                      numberOfStars={5}
                      starDimension="28px"
                      starSpacing="4px"
                      required="true"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">Review Title</label>
                    <input
                      required
                      name="reviewTitle"
                      placeholder="e.g. Absolutely Beautiful Craftsmanship"
                      className="w-full bg-surface border border-outline-variant/50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm font-body-base"
                      minLength={10}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">Review Details</label>
                    <textarea
                      rows={5}
                      required
                      name="reviewDesc"
                      placeholder="Share what you liked about the piece..."
                      className="w-full bg-surface border border-outline-variant/50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-sm font-body-base"
                      minLength={20}
                    />
                  </div>

                  <button className="w-full bg-primary text-white py-4 font-button-text uppercase tracking-widest hover:bg-primary-container transition-colors rounded-sm">
                    Submit Review
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
