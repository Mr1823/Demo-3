import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import { FiEdit2, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { Pagination } from "react-pagination-bar";
import useSearchedProducts from "../../../hooks/useSearchedProducts";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import AnimateText from "@moxy/react-animate-text";

const AdminProducts = () => {
  const [products, isProductsLoading, refetch] = useProducts();
  const [displayedProducts, setDisplayedProducts] = useState(products || []);
  const [searchText, setSearchText] = useState("");
  const [searchedProducts, isSearchLoading] = useSearchedProducts(searchText);
  const [axiosSecure] = useAxiosSecure();

  useEffect(() => {
    if (searchedProducts.length) {
      setDisplayedProducts(searchedProducts);
    } else {
      setDisplayedProducts(products);
    }
  }, [searchedProducts, products]);

  // pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const pageProductLimit = 10;

  // handle delete products
  const handleDeleteProduct = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#ef4c53",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "w-[85%] md:w-[32em] ml-14",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/admin/delete-product/${_id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "Product has been deleted.",
                icon: "success",
              });
            }
          })
          .catch((e) => console.error(e));
      }
    });
  };

  return (
    <div className="px-4">
      <div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/dashboard/adminDashboard"}>Dashboard</Link>
            </li>
            <li>
              <Link to="/dashboard/adminProducts">Manage Products</Link>
            </li>
          </ul>
        </div>

        <h2
          className="mt-1 font-bold text-3xl"
          style={{ fontFamily: "var(--italiana)" }}
        >
          <AnimateText initialDelay={0.2} wordDelay={0.2} separator="">
            <span>Products</span>
          </AnimateText>
        </h2>
      </div>

      <div className="p-4 shadow mt-10 border rounded-lg">
        <header className="flex flex-col md:flex-row justify-between items-stretch space-y-3 md:space-y-0">
          <div className="md:w-[30%]">
            <input
              type="text"
              name="searchInput"
              placeholder="🔎 Search by product name"
              className="text-sm px-3 h-[50px] w-full border border-black outline-none rounded"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Link to="/dashboard/adminAddProducts" className="md:w-[15%]">
            <button className="btn btn-neutral text-white border-none rounded w-full">
              <FiPlusCircle className="text-lg" />
              Add Product
            </button>
          </Link>
        </header>

        {isProductsLoading || isSearchLoading ? (
          <div>
            {searchedProducts?.length ? (
              <>
                {searchedProducts?.map((p) => (
                  <div className="skeleton w-full h-16 my-4" key={p._id}></div>
                ))}
              </>
            ) : (
              <div>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div className="skeleton w-full h-16 my-4" key={idx}></div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto mt-8 pb-5">
            <table className="table table-zebra">
              {/* head */}
              <thead>
                <tr className="text-black font-bold border-b-2 border-b-black">
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts
                  ?.slice(
                    (currentPage - 1) * pageProductLimit,
                    currentPage * pageProductLimit
                  )
                  .map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12 bg-slate-300">
                              <img src={product.img} alt={product.name} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        {product.stock > 10 ? (
                          <span className="bg-[#def2d0] text-[#4c7a2d] px-2 rounded">
                            {product.stock} in stock
                          </span>
                        ) : (
                          <>
                            {product.stock > 0 ? (
                              <span className="bg-[#f9f1c8] text-[#6a5c10] px-2 rounded">
                                {product.stock} Low in stock
                              </span>
                            ) : (
                              <span className="bg-[#c15656] text-[#ad2c2c] px-2 rounded">
                                Out of stock
                              </span>
                            )}
                          </>
                        )}
                      </td>
                      <td>{product.sold}</td>
                      <td>₹{product.discountPrice || product.price}</td>
                      <td className="space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row items-center">
                        <div className="tooltip" data-tip="Edit">
                          <Link
                            to={`/dashboard/adminAddProducts`}
                            state={{ id: product._id }}
                          >
                            <button className="bg-[var(--pink-gold)] text-white rounded-lg w-[32px] h-[32px]">
                              <FiEdit2 className="text-lg block mx-auto" />
                            </button>
                          </Link>
                        </div>

                        <div className="tooltip" data-tip="Delete">
                          <button
                            className="bg-red-400 text-white rounded-lg w-[32px] h-[32px]"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <FiTrash2 className="text-lg block mx-auto" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <p className="text-xs mt-3">
              Showing {currentPage > 1 ? currentPage - 1 : currentPage}
              {currentPage > 1 && displayedProducts?.length > 10 && "1"} to{" "}
              {Math.ceil(displayedProducts?.length / 10) === currentPage
                ? displayedProducts?.length % 10 !== 0
                  ? (currentPage - 1) * 10 + (displayedProducts?.length % 10)
                  : currentPage * 10
                : currentPage * 10}{" "}
              of {displayedProducts?.length}
            </p>
            <Pagination
              currentPage={currentPage}
              totalItems={displayedProducts?.length}
              onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
              itemsPerPage={pageProductLimit}
              pageNeighbours={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
