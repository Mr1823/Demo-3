import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthContext from "./useAuthContext";
import { getApiBaseUrl } from "../utils/apiConfig";

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuthContext();

  // Create an interceptor instance of Axios with a base URL
  const axiosSecure = axios.create({
    baseURL: getApiBaseUrl(),
  });

  // Add an interceptor to inject the authorization header
  axiosSecure.interceptors.request.use(
    (config) => {
      // Get the access token from localStorage
      const accessToken = localStorage.getItem("the-jewel-store-jwt-token");

      // If an access token exists, add it to the request headers
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add an interceptor to handle 401 and 403 responses
  axiosSecure.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Unauthorized or Forbidden status received, log the user out and redirect to the login page
        logOut()
          .then(() => {})
          .catch((err) => console.error(err));
        navigate("/login"); // Redirect to the login page
      }
      return Promise.reject(error);
    }
  );

  // Cleanup the interceptor on unmount
  useEffect(() => {
    return () => {
      axiosSecure.interceptors.request.eject(axiosSecure);
      axiosSecure.interceptors.response.eject(axiosSecure);
    };
  }, [axiosSecure]);

  return [axiosSecure];
};

export default useAxiosSecure;
