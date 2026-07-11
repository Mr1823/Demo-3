import React from "react";
import useWishlist from "../../hooks/useWishlist";
import { Link } from "react-router-dom";
import { RiCloseCircleLine } from "react-icons/ri";
import useCart from "../../hooks/useCart";
import Swal from "sweetalert2";
import useProducts from "../../hooks/useProducts";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const Wishlist = () => {
  const [wishlistData, isWishlistLoading, refetch] = useWishlist();
  const { cartData, addToCart, refetch: cartRefetch } = useCart();
  const [products] = useProducts();
  const [axiosSecure] = useAxiosSecure();

  // Check if item exist in cart
  const handleExistInCart = (productId) => {
    const foundProduct = cartData?.find((p) => p.productId == productId);
    if (foundProduct) {
      return true;
    }
    return false;
  };

  // Handle Add to Cart
  const handleAddToCart = (productId) => {
    // find the product
    const foundProduct = products?.find((p) => p._id === productId);

    if (foundProduct) {
      addToCart(foundProduct);
      cartRefetch();
    }
  };

  // Handle Delete from Wishlist
  const handleDeleteFromWishlist = (wishlistId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be removed from your wishlist",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#ef4c53",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/wishlist/${wishlistId}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Successful",
                text: "Product has been removed successfully.",
                icon: "success",
              });
              refetch();
            }
          })
          .catch((e) => console.error(e));
      }
    });
  };

  return (
    <div className="container mb-36" style={{ fontFamily: "var(--poppins)" }}>
      <CustomHelmet title="Wishlist" />
      <div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
          </ul>
        </div>

        <h2
          className="mt-1 font-bold text-4xl tracking-wider"
          style={{ fontFamily: "var(--italiana)" }}
        >
          My Wishlist
        </h2>
      </div>

      <div className="my-10 px-4">
        {isWishlistLoading ? (
          <div>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                className="skeleton w-full h-16 my-4 rounded-none"
                key={idx}
              ></div>
            ))}
          </div>
        ) : (
          <>
            {wishlistData?.length ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="text-lg font-bold text-black border-b-2 border-b-black">
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistData?.map((product) => (
                      <tr key={product._id} className="text-base">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src={product.img}
                                  alt={product.name}
                                  className="bg-slate-200"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>₹{product.discountPrice || product.price}</td>
                        <td>{product.stock}</td>
                        <th className="flex items-center gap-3">
                          {handleExistInCart(product.productId) ? (
                            <button
                              className="btn btn-neutral btn-wide"
                              disabled
                            >
                              Added to Cart
                            </button>
                          ) : (
                            <button
                              className="btn btn-neutral btn-wide"
                              onClick={() => handleAddToCart(product.productId)}
                            >
                              Add to Cart
                            </button>
                          )}
                          <div
                            className="tooltip"
                            data-tip="Remove from Wishlist"
                            onClick={() =>
                              handleDeleteFromWishlist(product._id)
                            }
                          >
                            <RiCloseCircleLine className="text-2xl" />
                          </div>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <h4 className="text-center font-bold">
                No items found in your wishlist.{" "}
                <Link to="/shop" className="underline text-blue-600">
                  Browse products
                </Link>
              </h4>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
