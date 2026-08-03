import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "../../hooks/useAuthContext";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import { CgCloseO } from "react-icons/cg";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { uploadToCloudinary, MAX_IMAGE_BYTES } from "../../utils/uploadToCloudinary";
import { getErrorMessage } from "../../utils/errorMessage";
import AnimateText from "@moxy/react-animate-text";

const AdminCategories = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [categoryAddError, setCategoryAddError] = useState(null);
  const [categoryUpdateError, setCategoryUpdateError] = useState(false);
  const [totalCount, setTotalCount] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const [axiosSecure] = useAxiosSecure();
  const [isUploading, setIsUploading] = useState(false);

  const {
    data: categories,
    isLoading: isCategoryLoading,
    refetch,
  } = useQuery({
    enabled: !isAuthLoading && user !== null && user !== undefined,
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const result = await axiosSecure.get("/categories");
      return result.data;
    },
  });

  useEffect(() => {
    const totalProducts = categories?.reduce(
      (total, item) => total + (parseInt(item.itemCount) || 0),
      0
    );

    setTotalCount({
      categoryCount: categories?.length || 0,
      productCount: totalProducts || 0,
    });
  }, [categories]);

  // add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryAddError(null);

    const form = e.target;
    const categoryName = form.categoryName.value;
    const file = form.categoryPicFile?.files?.[0];

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

    if (file && file.size > MAX_IMAGE_BYTES) {
      setCategoryAddError("Image must be 2MB or smaller.");
      return;
    }

    setIsUploading(true);
    try {
      // Uploaded through a server-signed request, the same path the product
      // form uses, so the Cloudinary secret never reaches the browser.
      const categoryPic = file ? await uploadToCloudinary(file, axiosSecure) : "";
      const res = await axiosSecure.post("/categories", { categoryName, categoryPic });
      if (res.data.success || res.data.insertedId) {
        form.reset();
        toast.success("Category Added Successfully", { position: "bottom-right" });
        refetch();
      }
    } catch (err) {
      setCategoryAddError(getErrorMessage(err, "Failed to add category"));
    } finally {
      setIsUploading(false);
    }
  };

  // update category data
  const handleOpenUpdateCategory = (category) => {
    setSelectedCategory(category);

    document.getElementById("update-category-modal").showModal();
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setCategoryUpdateError(false);

    const form = e.target;
    const categoryName = form.categoryName.value;
    const file = form.categoryPicFile?.files?.[0];

    if (categoryName === selectedCategory?.categoryName && !file) {
      setCategoryUpdateError(true);
      return;
    }

    if (file && file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be 2MB or smaller.");
      return;
    }

    setIsUploading(true);
    try {
      // No new file means keep whatever the category already has.
      const categoryPic = file
        ? await uploadToCloudinary(file, axiosSecure)
        : selectedCategory?.categoryPic;
      const res = await axiosSecure.patch(`/categories/${selectedCategory?._id}`, {
        categoryName: categoryName || selectedCategory?.categoryName,
        categoryPic,
      });
      if (res.data.success) {
        refetch();
        document.getElementById("update-category-modal").close();
        toast.success("Category Updated Successfully", { position: "bottom-right" });
        setCategoryUpdateError(false);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update category"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="h-20 flex items-center justify-between px-6 md:px-margin-desktop bg-background/80 backdrop-blur-md border-b border-outline-variant/30 z-40 shrink-0">
        <h2 className="font-display-lg text-headline-md text-primary">Categories</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-margin-desktop custom-scrollbar flex flex-col-reverse md:flex-row gap-6 items-start">
        {/* Table Section */}
        <div className="flex-1 bg-surface-dim border border-secondary/20 rounded-xl overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-outline-variant/50 bg-surface-container-high/50">
                <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Category</th>
                <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Items Count</th>
                <th className="px-6 py-4 font-label-caps text-outline text-[11px] text-right">Action</th>
              </tr>
            </thead>
            {isCategoryLoading ? (
              <tbody>
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-outline">
                    Loading categories...
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-outline-variant/20">
                {categories?.map((category) => (
                  <tr key={category.categoryName} className="hover:bg-white/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center overflow-hidden shrink-0 border border-outline-variant/30">
                          {category.categoryPic || category.image ? (
                            <img src={category.categoryPic || category.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-outline/40">image</span>
                          )}
                        </div>
                        <div className="font-medium text-on-surface">
                          {category.categoryName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-medium">
                      {category.itemCount || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="tooltip" data-tip="Edit">
                        <button
                          type="button"
                          aria-label={`Edit ${category.name || "category"}`}
                          className="inline-flex items-center justify-center w-11 h-11 rounded text-outline hover:text-primary hover:bg-surface-container transition-colors"
                          onClick={() => handleOpenUpdateCategory(category)}
                        >
                          <FiEdit2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
            {!isCategoryLoading && (
              <tfoot className="border-t border-outline-variant/50 bg-surface-container-low/50">
                <tr>
                  <td className="px-6 py-4 font-label-caps text-on-surface text-[11px]">Categories: {totalCount?.categoryCount}</td>
                  <td className="px-6 py-4 font-label-caps text-on-surface text-[11px]">Total Items: {totalCount?.productCount}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Add Category Section */}
        <div className="w-full md:w-[350px] shrink-0 bg-surface-dim border border-secondary/20 rounded-xl p-6 md:sticky md:top-0">
          <h4 className="font-display-lg text-headline-sm text-primary border-b border-outline-variant/30 pb-4 mb-6">
            Add New Category
          </h4>

          {categoryAddError && (
            <p className="text-error font-body-base text-sm mb-4 flex items-center gap-2">
              <CgCloseO /> {categoryAddError}
            </p>
          )}

          <form className="space-y-6" onSubmit={handleAddCategory}>
            <div className="flex flex-col">
              <label className="font-label-caps text-[11px] text-outline mb-2">Name of the Category</label>
              <input
                type="text"
                name="categoryName"
                placeholder="e.g. Platinum"
                className="w-full bg-transparent border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 px-0 py-2 text-body-base text-on-surface placeholder:text-outline-variant/50 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="font-label-caps text-[11px] text-outline mb-2">Category Photo</label>
              <input
                type="file"
                name="categoryPicFile"
                accept="image/*"
                required
                className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-sm file:border-0 file:font-label-caps file:text-[11px] file:uppercase file:tracking-[0.1em] file:bg-surface-container file:text-on-surface hover:file:bg-primary hover:file:text-white file:cursor-pointer file:transition-colors"
              />
              <p className="text-[11px] text-on-surface-variant mt-2">JPG or PNG, up to 2MB. Uploaded to Cloudinary.</p>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-primary text-white py-3 rounded font-button-text hover:bg-primary/90 transition-colors"
            >
              <FiPlusCircle className="text-lg" /> Add Category
            </button>
          </form>
        </div>
      </div>

      <dialog id="update-category-modal" className="modal">
        <div className="modal-box bg-surface border border-outline-variant/20 rounded-xl p-8 max-w-md">
          <form method="dialog">
            <button
              aria-label="Close"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors absolute right-2 top-2"
              onClick={() => setSelectedCategory({})}
            >
              ✕
            </button>
          </form>
          <h3 className="font-display-lg text-headline-sm text-primary mb-6">Update Category</h3>

          {categoryUpdateError && (
            <p className="text-error font-body-base text-sm mb-4">
              Can't update. Data hasn't changed!
            </p>
          )}
          
          <form className="space-y-6" onSubmit={handleUpdateCategory}>
            <div className="flex flex-col">
              <label className="font-label-caps text-[11px] text-outline mb-2">
                Name of the Category
              </label>
              <input
                type="text"
                name="categoryName"
                defaultValue={selectedCategory?.categoryName}
                className="w-full bg-transparent border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 px-0 py-2 text-body-base text-on-surface transition-colors"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="font-label-caps text-[11px] text-outline mb-2">Category Photo</label>
              <input
                type="file"
                name="categoryPicFile"
                accept="image/*"
                className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-sm file:border-0 file:font-label-caps file:text-[11px] file:uppercase file:tracking-[0.1em] file:bg-surface-container file:text-on-surface hover:file:bg-primary hover:file:text-white file:cursor-pointer file:transition-colors"
              />
              <p className="text-[11px] text-on-surface-variant mt-2">Leave empty to keep the current image.</p>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={isUploading} className="disabled:opacity-60 bg-primary text-white px-6 py-3 min-h-11 rounded font-button-text hover:bg-primary/90 transition-colors">
                Update Category
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AdminCategories;
