import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AdminProducts = () => {
  const [products, isProductsLoading, refetch] = useProducts();
  const [axiosSecure] = useAxiosSecure();
  const [searchText, setSearchText] = useState("");
  
  const displayedProducts = (products || []).filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDeleteProduct = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#704c31",
      cancelButtonColor: "#ba1a1a",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/admin/delete-product/${_id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", "Product has been deleted.", "success");
          }
        }).catch(err => {
            console.error("Delete failed:", err);
            Swal.fire("Error!", "Could not delete product.", "error");
        });
      }
    });
  };

  const handleToggleVisibility = (_id, currentStatus) => {
    axiosSecure.patch(`/products/${_id}`, { isActive: !currentStatus })
      .then(res => {
        if (res.data.success || res.data.modifiedCount > 0) {
          refetch();
        }
      }).catch(err => {
        console.error("Toggle visibility failed:", err);
      });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="h-20 flex items-center justify-between px-6 md:px-margin-desktop bg-background/80 backdrop-blur-md border-b border-outline-variant/30 z-40">
        <h2 className="font-display-lg text-headline-md text-primary">Products</h2>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative w-48 md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-body-base outline-none transition-all placeholder:text-outline/60" 
              placeholder="Search products..." 
              type="text" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Link to="/dashboard/adminAddProducts">
            <button className="flex items-center gap-2 bg-primary-container text-white px-4 md:px-6 py-2.5 rounded-lg font-button-text hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden md:inline">Add Product</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Table Section */}
      <section className="flex-1 overflow-y-auto p-4 md:p-margin-desktop custom-scrollbar">
        <div className="bg-surface-dim border border-secondary/20 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant/50 bg-surface-container-high/50">
                <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Thumbnail</th>
                <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Product Name</th>
                <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Category</th>
                <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Price/Quote</th>
                <th className="px-6 py-4 font-label-caps text-outline text-[11px] text-center">Status</th>
                <th className="px-6 py-4 font-label-caps text-outline text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {displayedProducts.map(product => (
                <tr key={product._id} className="hover:bg-white/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded bg-surface-container-highest border border-outline-variant/30 overflow-hidden">
                      <img src={product.image || product.img || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-button-text text-primary">{product.name}</p>
                    <p className="text-[12px] text-outline">SKU: {product.productId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-[12px] font-medium border border-outline-variant/30">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    {product.isQuoteOnly ? (
                      <p className="font-button-text italic text-outline">Quote Only</p>
                    ) : product.price ? (
                      <p className="font-button-text">₹ {product.price}</p>
                    ) : (
                      <p className="font-button-text italic text-outline">Dynamic</p>
                    )}
                    <p className="text-[11px] text-tertiary-container uppercase tracking-tighter">
                      {product.metalType || "Gold"} | {product.weight}g
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-block w-[44px] h-[22px]">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={product.isActive !== false} 
                        onChange={() => handleToggleVisibility(product._id, product.isActive !== false)}
                      />
                      <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-[34px] ${product.isActive !== false ? 'bg-primary-container' : 'bg-outline-variant'} before:absolute before:content-[''] before:h-[16px] before:w-[16px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-300 before:rounded-full ${product.isActive !== false ? 'before:translate-x-[22px]' : ''}`}></span>
                    </label>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/dashboard/adminAddProducts/${product._id}`}>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/50 text-outline hover:text-primary hover:border-primary transition-all">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </Link>
                      <button onClick={() => handleDeleteProduct(product._id)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/50 text-outline hover:text-error hover:border-error transition-all">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedProducts.length === 0 && !isProductsLoading && (
                  <tr>
                      <td colSpan="6" className="text-center py-10 text-outline font-body-base">No products found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminProducts;
