import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../pages/Header/Header";
import Footer from "../pages/Footer/Footer";
import { Toaster } from "react-hot-toast";
import TakeToLoginModal from "../components/TakeToLoginModal/TakeToLoginModal";
import useAuthContext from "../hooks/useAuthContext";
import AOS from "aos";
import "aos/dist/aos.css";

const MainLayout = () => {
  const location = useLocation();
  const { user, isAuthLoading } = useAuthContext();
  const [showLoginNudge, setShowLoginNudge] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    if (
      (location?.pathname?.includes("description") &&
        location?.state?.from !== "/") ||
      (location?.pathname?.includes("reviews") && location?.state?.from !== "/")
    ) {
      // ignore scroll to top in dynamic product page details navigation
    } else {
      document.documentElement.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [location]);

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  // ─── Login Nudge: 30-second timer (PRD §4.3) ──────────────────────────────
  useEffect(() => {
    // Only start timer if user is NOT logged in and hasn't dismissed it this session
    if (user || isAuthLoading) return;
    
    const alreadyShown = sessionStorage.getItem("login-nudge-shown");
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      // Double-check user hasn't logged in during the 30s
      if (!user) {
        setShowLoginNudge(true);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [user, isAuthLoading]);

  const handleCloseNudge = () => {
    setShowLoginNudge(false);
    sessionStorage.setItem("login-nudge-shown", "true");
  };

  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="w-full">
      <Header />
      <Outlet />
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-bold py-8",
          style: {
            fontFamily: "var(--poppins)",
            padding: "15px 20px",
            maxWidth: "max-content",
          },
        }}
      />
      {!isAuthRoute && (
        <TakeToLoginModal
          isOpen={showLoginNudge}
          onClose={handleCloseNudge}
          message="Save your favorites and track orders effortlessly. Enjoy exclusive access to our collections."
        />
      )}
    </div>
  );
};

export default MainLayout;
