import React, { useEffect, useState } from "react";
import { createContext } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";
import { getApiBaseUrl } from "../utils/apiConfig";

export const AuthContext = createContext(null);
const auth = getAuth(app);

// google provier
const googleProvider = new GoogleAuthProvider();

// Dev admin credentials (bypass Firebase for local development)
const DEV_ADMIN = {
  email: "admin@buildwithus",
  password: "Buildwith@us",
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDevUser, setIsDevUser] = useState(false);

  // Sign Up with email/pass
  const signUp = (email, password) => {
    setIsAuthLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update user's profile
  const updateUserProfile = (name, photoURL) => {
    setIsAuthLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  // Dev Sign In — bypasses Firebase entirely
  const devSignIn = (email, password) => {
    if (email === DEV_ADMIN.email && password === DEV_ADMIN.password) {
      const mockUser = {
        uid: "dev-admin-uid",
        email: DEV_ADMIN.email,
        displayName: "Admin",
        photoURL: "/placeholder-user.png",
      };
      const mockToken = `dev-jwt-token-${Date.now()}`;
      localStorage.setItem("the-jewel-store-jwt-token", mockToken);
      setUser(mockUser);
      setIsDevUser(true);
      setIsAuthLoading(false);
      return Promise.resolve({ user: mockUser });
    }
    return Promise.reject({ code: "auth/invalid-dev-credentials" });
  };

  // Sign In with email/pass (tries dev bypass first, then Firebase)
  const signIn = (email, password) => {
    // Check dev admin credentials first
    if (email === DEV_ADMIN.email && password === DEV_ADMIN.password) {
      return devSignIn(email, password);
    }
    // Fall through to Firebase for all other credentials
    setIsAuthLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign in
  const signInGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Sign Out
  const logOut = () => {
    if (isDevUser) {
      localStorage.removeItem("the-jewel-store-jwt-token");
      setUser(null);
      setIsDevUser(false);
      setIsAuthLoading(false);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  // Auth State Observer
  useEffect(() => {
    // If dev user is already logged in, skip Firebase observer setup
    if (isDevUser) return;

    // Check if dev session exists in localStorage on mount
    const storedToken = localStorage.getItem("the-jewel-store-jwt-token");
    if (storedToken && storedToken.startsWith("dev-jwt-token-")) {
      setUser({
        uid: "dev-admin-uid",
        email: DEV_ADMIN.email,
        displayName: "Admin",
        photoURL: "/placeholder-user.png",
      });
      setIsDevUser(true);
      setIsAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.uid !== undefined) {
        setUser(currentUser);
        const apiBaseUrl = getApiBaseUrl();
        axios
          .post(`${apiBaseUrl}/jwt`, {
            email: currentUser.email,
          })
          .then((res) => {
            if (res.data.token) {
              localStorage.setItem("the-jewel-store-jwt-token", res.data.token);
              setIsAuthLoading(false);
            } else {
              setIsAuthLoading(false);
            }
          })
          .catch((err) => {
            console.error("JWT fetch failed:", err);
            setIsAuthLoading(false); // don't hang forever
          });
      } else {
        localStorage.removeItem("the-jewel-store-jwt-token");
        setUser(null);
        setIsAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [isDevUser]);

  const value = {
    user,
    isAuthLoading,
    signUp,
    updateUserProfile,
    signIn,
    signInGoogle,
    logOut,
    setIsAuthLoading,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
