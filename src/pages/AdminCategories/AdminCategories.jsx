import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "../../hooks/useAuthContext";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import { CgCloseO } from "react-icons/cg";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AnimateText from "@moxy/react-animate-text";

const AdminCategories = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [categoryAddError, setCategoryAddError] = useState(null);
  const [categoryUpdateError, setCategoryUpdateError] = useState(false);
  const [totalCount, setTotalCount] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const [axiosSecure] = useAxiosSecure();

  const {
    data: categories,
    isLoading: isCategoryLoading,
    refetch,
  } = useQuery({
    enabled: !isAuthLoading && user !== null && user !== undefined,
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const result = await axiosSecure.get("/admin/categories");
      return result.data;
    },
  });

  useEffect(() => {
    const totalProducts = categories?.reduce(
      (total, item) => (total += parseInt(item.itemCount)),
      0
    );

    setTotalCount({
      categoryCount: categories?.length,
      productCount: totalProducts,
    });
  }, [categories]);

  // add new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    setCategoryAddError(null);

    const form = e.target;
    const categoryName = form.categoryName.value;
    const categoryPic = form.categoryPicLink.value;

    const existingCategories = categories?.map((c) =>
      c.categoryName?.toLowerCase()
    );
    const categoryExists = existingCategories?.indexOf(
      categoryName?.toLowerCase()
    );

    if (categoryExists !== -1) {
      setCategoryAddError("Can't add category! Category already exists.");
      form.reset();
      return;
    }

    axiosSecure
      .post("/categories", { categoryName, categoryPic })
      .then((res) => {
        if (res.data.insertedId) {
          form.reset();
          toast.success("Category Added Successfully", {
            position: "bottom-right",
          });
          refetch();
        }
      })
      .catch((e) => setCategoryAddError(e));
  };

  // update category data
  const handleOpenUpdateCategory = (category) => {
    setSelectedCategory(category);

    document.getElementById("update-category-modal").showModal();
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    setCategoryUpdateError(false);

    const form = e.target;
    const categoryName = form.categoryName.value;
    const categoryPic = form.categoryPicLink.value;

    if (
      categoryName === selectedCategory?.categoryName &&
      categoryPic === selectedCategory?.categoryPic
    ) {
      setCategoryUpdateError(true);
      return;
    }

    axiosSecure
      .patch(`/categories/${selectedCategory?.categoryId}`, {
        categoryName: categoryName || selectedCategory?.categoryName,
        categoryPic: categoryPic || selectedCategory?.categoryPic,
      })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          document.getElementById("update-category-modal").close();
          toast.success("Category Updated Successfully", {
            position: "bottom-right",
          });
          setCategoryUpdateError(false);
        }
      })
      .catch((e) => {
        console.error(e);
        setCategoryUpdateError(false);
      });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-margin-desktop bg-background custom-scrollbar w-full">
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link to={"/dashboard/adminDashboard"}>Dashboard</Link>
          </li>
          <li>
            <Link to="/dashboard/adminCategories">Categories</Link>
          </li>
        </ul>
      </div>

      <h2
        className="mt-1 font-bold text-3xl"
        style={{ fontFamily: "var(--italiana)" }}
      >
        <AnimateText initialDelay={0.2} wordDelay={0.2} separator="">
          <span>Categories</span>
        </AnimateText>
      </h2>

      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-x-8 mt-10 px-4 md:px-0">
        <div className="overflow-x-auto border rounded-lg shadow w-[78vw] md:w-[65%] relative">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="text-black font-bold border-b-2 border-black text-lg">
                <th>Categories</th>
                <th>Items Count</th>
                <th>Action</th>
              </tr>
            </thead>
            {isCategoryLoading ? (
              <>
                <td></td>
                <div>
                  <span className="loading loading-spinner loading-md block ml-10 my-4"></span>
                </div>
              </>
            ) : (
              <tbody>
                {categories?.map((category) => (
                  <tr key={category.categoryName} className="text-base">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={category.categoryPic} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {category.categoryName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{category.itemCount}</td>
                    <td>
                      <div className="tooltip" data-tip="Edit">
                        <button
                          className="bg-[var(--pink-gold)] text-white rounded-lg w-[32px] h-[32px]"
                          onClick={() => handleOpenUpdateCategory(category)}
                        >
                          <FiEdit2 className="text-lg block mx-auto" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}

            <tfoot className="text-black">
              <tr>
                <th>Categories: {totalCount?.categoryCount}</th>
                <th>Total Items: {totalCount?.productCount}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="border rounded-lg shadow w-full md:w-[35%] md:sticky md:top-20 mb-10 md:mb-0">
          <h4 className="font-semibold text-gray-600 border-b-2 p-4">
            Add New Category
          </h4>

          {categoryAddError && (
            <p className="px-4 text-error text-sm font-semibold flex gap-2 mt-4">
              <CgCloseO className="text-base" /> {categoryAddError}
            </p>
          )}

          <form className="mt-8 space-y-8" onSubmit={handleAddCategory}>
            <div className="flex flex-col px-4">
              <label className="text-xs font-bold">Name of the Category</label>
              <input
                type="text"
                name="categoryName"
                placeholder="name"
                className="border-b-2 border-gray-300 focus:border-black outline-none text-sm transition-all duration-500 ease-in-out py-3"
                required
              />
            </div>

            <div className="flex flex-col px-4">
              <label className="text-xs font-bold">Category Photo URL</label>
              <input
                type="text"
                name="categoryPicLink"
                placeholder="photo url"
                className="border-b-2 border-gray-300 focus:border-black outline-none text-sm transition-all duration-500 ease-in-out py-3"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-neutral btn-block rounded-none text-white rounded-b-lg"
            >
              <FiPlusCircle className="text-lg" /> Add Category
            </button>
          </form>
        </div>
      </div>

      <dialog id="update-category-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setSelectedCategory({})}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Update Category</h3>

          {categoryUpdateError && (
            <p className="text-error font-medium mt-2">
              Can&apos;t update. Data hasn&apos;t changed!
            </p>
          )}
          <form className="mt-6 space-y-8" onSubmit={handleUpdateCategory}>
            <div className="flex flex-col px-4">
              <label className="text-xs font-bold">
                Name of the Category
              </label>
              <input
                type="text"
                name="categoryName"
                defaultValue={selectedCategory?.categoryName}
                className="border-b-2 border-gray-300 focus:border-black outline-none text-sm transition-all duration-500 ease-in-out py-3"
                required
              />
            </div>

            <div className="flex flex-col px-4">
              <label className="text-xs font-bold">Category Photo URL</label>
              <input
                type="text"
                name="categoryPicLink"
                defaultValue={selectedCategory?.categoryPic}
                className="border-b-2 border-gray-300 focus:border-black outline-none text-sm transition-all duration-500 ease-in-out py-3"
                required
              />
            </div>

            <button type="submit" className="btn btn-neutral text-white ml-3">
              Update
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AdminCategories;
