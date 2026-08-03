import React, { useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Header from "../pages/Header/Header";
import Footer from "../pages/Footer/Footer";
import { Toaster, toast } from "react-hot-toast";
import useAuthContext from "../hooks/useAuthContext";
import AOS from "aos";
import { LoginGateProvider } from "../context/LoginGateContext";
import useResumePendingAction from "../hooks/useResumePendingAction";
import "aos/dist/aos.css";

// How often a signed-out visitor is invited to sign in. The prompt repeats
// until they do; raise this if it starts to feel like nagging.
const LOGIN_NUDGE_INTERVAL_MS = 30 * 1000;
// How long each prompt stays on screen — comfortably shorter than the interval
// so there is a quiet gap rather than a permanent banner.
const NUDGE_VISIBLE_MS = 15 * 1000;
// Prompting someone to sign in while they are on the sign-in page is noise.
const AUTH_PATHS = ["/login", "/register", "/admin-login"];

const MainLayoutInner = () => {
  useResumePendingAction();
  const location = useLocation();
  const { user, isAuthLoading } = useAuthContext();

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

  // ─── Login Nudge (PRD §4.3) ───────────────────────────────────────────────
  // Repeats on this interval until the visitor signs in, rather than showing
  // once per tab. Dial it up here if it starts to feel like nagging.
  useEffect(() => {
    if (user || isAuthLoading) return;

    const showNudge = () => {
      const currentPath = window.location.pathname;
      // Never interrupt someone already on an auth screen, and re-check the
      // user because they may have signed in since the last tick.
      if (!user && !AUTH_PATHS.includes(currentPath)) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-fade-in-up' : 'animate-fade-out-down'
              } max-w-sm w-full bg-surface-dim shadow-xl rounded-lg pointer-events-auto flex border border-outline-variant/30 font-body-base overflow-hidden`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img className="h-10 w-10 rounded-full object-contain p-1 border border-outline-variant/20 bg-white" src="/logo.png" alt="Logo" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-display-lg text-primary font-medium uppercase tracking-[0.05em]">
                      A Warm Welcome
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">
                      Save your favorites and track orders effortlessly.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-outline-variant/20 flex-col shrink-0">
                <Link
                  to="/login"
                  state={{ from: currentPath }}
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                  className="w-full flex-1 p-4 flex items-center justify-center text-[12px] font-button-text text-primary hover:bg-surface-container transition-colors focus:outline-none"
                >
                  SIGN IN
                </Link>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                  className="w-full flex-1 border-t border-outline-variant/20 p-4 flex items-center justify-center text-[11px] font-label-caps uppercase tracking-wider text-outline hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          ),
          // The fixed id means a re-fire replaces the existing toast rather
          // than stacking a second one.
          { duration: NUDGE_VISIBLE_MS, position: "bottom-right", id: "login-nudge-toast" }
        );
      }
    };

    // setInterval already fires first at one full interval, so no separate
    // initial timeout is needed.
    const repeat = setInterval(showNudge, LOGIN_NUDGE_INTERVAL_MS);

    return () => {
      clearInterval(repeat);
      // Signing in mid-cycle should take the prompt away immediately.
      toast.dismiss("login-nudge-toast");
    };
  }, [user, isAuthLoading]);

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
    </div>
  );
};

const MainLayout = () => (
  <LoginGateProvider>
    <MainLayoutInner />
  </LoginGateProvider>
);

export default MainLayout;
