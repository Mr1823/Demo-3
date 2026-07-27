import React, { useEffect, useState, useCallback } from "react";
import { createContext } from "react";
import axios from "axios";
import { getApiBaseUrl } from "../utils/apiConfig";

export const AuthContext = createContext(null);

const TOKEN_KEY = "sri-ram-access-token";
const REFRESH_KEY = "sri-ram-refresh-token";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const apiBase = getApiBaseUrl();

  // ─── Token helpers ─────────────────────────────────────────────────────────
  const storeTokens = (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  };

  const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
  const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

  /**
   * Decode JWT payload (without verification — just to read expiry/user data).
   */
  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  /**
   * Check if a JWT is expired (with 30s buffer for clock skew).
   */
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now() + 30000; // 30s buffer
  };

  // ─── Auth actions ──────────────────────────────────────────────────────────

  /**
   * Sign Up — POST /api/auth/register
   */
  const signUp = async (name, email, password) => {
    setIsAuthLoading(true);
    try {
      const res = await axios.post(`${apiBase}/auth/register`, { name, email, password });
      const { accessToken, refreshToken, user: userData } = res.data;
      storeTokens(accessToken, refreshToken);
      setUser(userData);
      setIsAuthLoading(false);
      return res.data;
    } catch (error) {
      setIsAuthLoading(false);
      throw error.response?.data || error;
    }
  };

  /**
   * Sign In — POST /api/auth/login
   */
  const signIn = async (email, password) => {
    setIsAuthLoading(true);
    try {
      const res = await axios.post(`${apiBase}/auth/login`, { email, password });
      const { accessToken, refreshToken, user: userData } = res.data;
      storeTokens(accessToken, refreshToken);
      setUser(userData);
      setIsAuthLoading(false);
      return res.data;
    } catch (error) {
      setIsAuthLoading(false);
      throw error.response?.data || error;
    }
  };

  /**
   * Refresh the access token using the stored refresh token.
   * Returns the new access token, or null on failure.
   */
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await axios.post(`${apiBase}/auth/refresh`, { refreshToken });
      const { accessToken: newAccess, refreshToken: newRefresh, user: userData } = res.data;
      storeTokens(newAccess, newRefresh);
      setUser(userData);
      return newAccess;
    } catch {
      // Refresh failed — session expired
      clearTokens();
      setUser(null);
      return null;
    }
  }, [apiBase]);

  /**
   * Log Out — POST /api/auth/logout
   */
  const logOut = async () => {
    try {
      const token = getAccessToken();
      if (token) {
        await axios.post(`${apiBase}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Silent fail — we're clearing tokens regardless
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthLoading(false);
    }
  };

  // ─── Session bootstrap (on app load) ───────────────────────────────────────
  useEffect(() => {
    const bootstrapAuth = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setUser(null);
        setIsAuthLoading(false);
        return;
      }

      // If token is still valid, decode user from it
      if (!isTokenExpired(accessToken)) {
        const decoded = decodeToken(accessToken);
        if (decoded) {
          setUser({
            _id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name,
          });

          // Also fetch full user profile from backend
          try {
            const res = await axios.get(`${apiBase}/users/me`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.data?.success && res.data?.data) {
              setUser(res.data.data);
            }
          } catch {
            // Token might have been invalidated server-side
            const newToken = await refreshAccessToken();
            if (!newToken) {
              clearTokens();
              setUser(null);
            }
          }
        }
        setIsAuthLoading(false);
        return;
      }

      // Token expired — try refresh
      const newToken = await refreshAccessToken();
      if (!newToken) {
        clearTokens();
        setUser(null);
      }
      setIsAuthLoading(false);
    };

    bootstrapAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    user,
    isAuthLoading,
    signUp,
    signIn,
    logOut,
    refreshAccessToken,
    setIsAuthLoading,
    getAccessToken,
    getRefreshToken,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
