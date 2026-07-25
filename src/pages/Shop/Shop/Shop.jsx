import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useFilterProducts from "../../../hooks/useFilterProducts";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { Pagination } from "react-pagination-bar";
import useProducts from "../../../hooks/useProducts";
import axios from "axios";
import { getApiBaseUrl } from "../../../utils/apiConfig";
import CardSkeleton from "../../../components/CardSkeleton/CardSkeleton";
import CustomHelmet from "../../../components/CustomHelmet/CustomHelmet";
import Pace from "pace-js";
import { useMediaQuery } from "react-responsive";

const Shop = () => {
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const location = useLocation();
  const [products] = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filterLoading, setFilterLoading] = useState(false);
  const [category, setCategory] = useState(location.state?.category || "all");
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [maximumPrice, setMaximumPrice] = useState(0);
  const [priceSortingOrder, setPriceSortingOrder] = useState("all");
  const [size, setSize] = useState("all");
  const [carate, setCarate] = useState("all");
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageProductLimit = 12; // 4 columns grid

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      right: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  useEffect(() => {
    const prices = products?.map((p) => parseFloat(p.price));
    if (prices) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setMinimumPrice(parseFloat(minPrice));
      setMaximumPrice(parseFloat(maxPrice));
    }
  }, [products]);

  useEffect(() => {
    setFilterLoading(true);
    const apiBaseUrl = getApiBaseUrl();
    axios
      .get(
        `${apiBaseUrl}/products/filter?category=${category}&minPrice=${minimumPrice}&maxPrice=${maximumPrice}&priceOrder=${priceSortingOrder}&size=${size}&carate=${carate}&search=${searchText}`
      )
      .then((res) => {
        setFilteredProducts(res.data);
        setFilterLoading(false);
        location.state = {};
      })
      .catch((error) => {
        console.error(error);
        setFilterLoading(false);
      });
  }, [
    category,
    minimumPrice,
    maximumPrice,
    priceSortingOrder,
    size,
    carate,
    searchText,
    location,
  ]);

  const { getUniqueProducts } = useFilterProducts();
  const filterCategories = getUniqueProducts("category");
  const filterSizes = getUniqueProducts("size");
  const filterCarates = getUniqueProducts("carate");
  const [allFilteredCategories, setAllFilteredCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const apiBaseUrl = getApiBaseUrl();
    axios
      .get(`${apiBaseUrl}/categories`)
      .then((res) => {
        setAllCategories(res.data);
      })
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (filterCategories && allCategories) {
      const allValue = filterCategories.find((category) => category.All)?.All || 0;
      const resultArray = allCategories.map((category) => {
        const categoryName = category.categoryName;
        const correspondingValue = filterCategories.find(
          (filterCategory) => filterCategory[categoryName]
        ) || { [categoryName]: 0 };
        return { [categoryName]: correspondingValue[categoryName] };
      });
      resultArray.unshift({ All: allValue });
      setAllFilteredCategories(resultArray);
    }
  }, [allCategories, filterCategories]);

  useEffect(() => {
    if (location.pathname.includes("shop")) {
      Pace.restart();
    }
  }, [location]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col gap-12 font-body">
      <CustomHelmet title={"Shop"} />

      {/* Header Area: Breadcrumbs & Title */}
      <section className="flex flex-col items-center text-center gap-3">
        <nav className="font-body text-[13px] text-on-surface-variant">
          <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          <span className="mx-2 text-outline-variant">/</span>
          <Link className="hover:text-primary transition-colors" to="/shop">Collections</Link>
          <span className="mx-2 text-outline-variant">/</span>
          <span className="text-primary font-medium">All Jewellery</span>
        </nav>
        <div className="relative inline-block mt-2">
          <h1 className="font-display text-[48px] md:text-5xl lg:text-6xl text-primary">The Collection</h1>
          <div className="absolute -bottom-3 left-1/4 right-1/4 h-[1px] bg-secondary-fixed-dim/50"></div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="flex flex-col md:flex-row justify-between items-center border-y border-outline-variant/30 py-6 gap-6 bg-surface-container-low/30 px-6">
        <div className="flex gap-4 md:gap-8 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {/* Category */}
          <div className="relative group shrink-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent border-none text-on-surface font-body font-semibold uppercase tracking-widest text-xs focus:ring-0 cursor-pointer outline-none appearance-none pr-6"
            >
              <option value="all">All Categories</option>
              {allFilteredCategories?.map((cat) => Object.keys(cat)[0] !== "All" && (
                <option key={Object.keys(cat)[0]} value={Object.keys(cat)[0]}>
                  {Object.keys(cat)[0]}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-sm absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface">expand_more</span>
          </div>

          {/* Carate / Metal Purity */}
          <div className="relative group shrink-0">
            <select
              value={carate}
              onChange={(e) => setCarate(e.target.value)}
              className="bg-transparent border-none text-on-surface font-body font-semibold uppercase tracking-widest text-xs focus:ring-0 cursor-pointer outline-none appearance-none pr-6"
            >
              <option value="all">Metal Purity</option>
              {filterCarates?.map((car) => Object.keys(car)[0].toLowerCase() !== "all" && (
                <option key={Object.keys(car)[0]} value={Object.keys(car)[0]}>
                  {Object.keys(car)[0]}K
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-sm absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface">expand_more</span>
          </div>

          {/* Size */}
          <div className="relative group shrink-0">
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="bg-transparent border-none text-on-surface font-body font-semibold uppercase tracking-widest text-xs focus:ring-0 cursor-pointer outline-none appearance-none pr-6"
            >
              <option value="all">Size</option>
              {filterSizes?.map((sz) => Object.keys(sz)[0].toLowerCase() !== "all" && (
                <option key={Object.keys(sz)[0]} value={Object.keys(sz)[0]}>
                  {Object.keys(sz)[0]}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-sm absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface">expand_more</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8 w-full lg:w-auto shrink-0 justify-between lg:justify-end">
          {/* Search */}
          <div className="relative flex items-center border-b border-outline-variant focus-within:border-primary transition-colors pb-1 w-full sm:w-auto">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">search</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full sm:w-32 lg:w-48 outline-none text-on-surface placeholder:text-outline-variant"
            />
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 font-body text-on-surface-variant whitespace-nowrap shrink-0">
            <span className="text-[11px] uppercase tracking-widest">Sort by:</span>
            <div className="relative">
              <select
                value={priceSortingOrder}
                onChange={(e) => setPriceSortingOrder(e.target.value)}
                className="bg-transparent border-none text-primary font-bold font-body uppercase tracking-widest text-xs focus:ring-0 cursor-pointer outline-none appearance-none pr-5 hover:text-primary-container transition-colors"
              >
                <option value="all">Featured</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
              <span className="material-symbols-outlined text-[14px] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary">sort</span>
            </div>
          </div>
        </div>
      </section>

      {/* Clear Filters (if any active) */}
      {(category !== "all" || size !== "all" || carate !== "all" || searchText !== "") && (
        <div className="flex gap-4 flex-wrap text-sm px-6">
          <button onClick={() => { setCategory("all"); setSize("all"); setCarate("all"); setSearchText(""); }} className="text-red-800 hover:text-red-600 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">close</span> Clear All Filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
        {filterLoading ? (
          [...Array(pageProductLimit)].map((_, idx) => (
            <CardSkeleton key={idx} height={isMobile ? "300px" : "400px"} width={"100%"} />
          ))
        ) : (
          <>
            {filteredProducts?.length ? (
              filteredProducts
                ?.slice((currentPage - 1) * pageProductLimit, currentPage * pageProductLimit)
                .map((product) => (
                  <ProductCard key={product._id} cardData={product} />
                ))
            ) : (
              <div className="col-span-full flex flex-col justify-center items-center py-20 opacity-60">
                <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                <h4 className="text-xl font-medium font-display">
                  No items match your criteria
                </h4>
              </div>
            )}
          </>
        )}
      </section>

      {/* Pagination */}
      {!filterLoading && filteredProducts?.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            itemsPerPage={pageProductLimit}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            totalItems={filteredProducts?.length}
            pageNeighbours={isMobile ? 1 : 2}
          />
        </div>
      )}
    </main>
  );
};

export default Shop;
