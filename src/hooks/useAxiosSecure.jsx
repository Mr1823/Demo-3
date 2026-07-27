import { useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthContext from "./useAuthContext";
import { getApiBaseUrl } from "../utils/apiConfig";

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut, refreshAccessToken, getAccessToken } = useAuthContext();

  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: getApiBaseUrl(),
    });

    // ─── Request interceptor: attach access token ──────────────────────────
    instance.interceptors.request.use(
      (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ─── Response interceptor: handle 401 with silent refresh ──────────────
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't retried yet, try refreshing the token
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          error.response?.data?.code === "TOKEN_EXPIRED"
        ) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();
            if (newToken) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return instance(originalRequest);
            }
          } catch {
            // Refresh failed
          }

          // Refresh failed — log out and redirect
          await logOut();
          navigate("/login");
          return Promise.reject(error);
        }

        // 403 Forbidden — redirect to home
        if (error.response?.status === 403) {
          navigate("/");
          return Promise.reject(error);
        }

        // Any other 401 (invalid token, not just expired)
        if (error.response?.status === 401) {
          await logOut();
          navigate("/login");
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [logOut, refreshAccessToken, getAccessToken, navigate]);

  return [axiosSecure];
};

export default useAxiosSecure;
