import axios from "axios";
import React, { useEffect, useState } from "react";
import { getApiBaseUrl } from "../utils/apiConfig";

const useSearchedProducts = (searchText) => {
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  useEffect(() => {
    setIsSearchLoading(true);
    const apiBaseUrl = getApiBaseUrl();
    axios
      .get(
        `${apiBaseUrl}/products?searchText=${searchText}`
      )
      .then((res) => {
        setSearchedProducts(Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []));
        setIsSearchLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsSearchLoading(false);
      });
  }, [searchText]);

  return [searchedProducts, isSearchLoading];
};

export default useSearchedProducts;
