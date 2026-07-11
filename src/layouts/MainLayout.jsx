import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../pages/Header/Header";
import Footer from "../pages/Footer/Footer";
import { Toaster } from "react-hot-toast";
import TakeToLoginModal from "../components/TakeToLoginModal/TakeToLoginModal";
import AOS from "aos";
import "aos/dist/aos.css";

const MainLayout = () => {
  // scroll to top on route change
  const location = useLocation();

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

  return (
    <div className="max-w-screen-2xl mx-auto">
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
      <TakeToLoginModal />
    </div>
  );
};

export default MainLayout;
