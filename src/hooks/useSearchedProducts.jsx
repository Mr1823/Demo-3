import React, { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuthContext from "./useAuthContext";

const useSearchedProducts = (searchText) => {
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const { isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  useEffect(() => {
    if (isAuthLoading) return;

    setIsSearchLoading(true);
    axiosSecure
      .get(`/products/search?q=${searchText || ""}`)
      .then((res) => {
        setSearchedProducts(
          Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : [])
        );
        setIsSearchLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsSearchLoading(false);
      });
  }, [searchText, isAuthLoading]);

  return [searchedProducts, isSearchLoading];
};

export default useSearchedProducts;
