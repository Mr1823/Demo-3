import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import TakeToLoginModal from "../components/TakeToLoginModal/TakeToLoginModal";
import useAuthContext from "../hooks/useAuthContext";

const LoginGateContext = createContext(null);

const PENDING_KEY = "sri-ram-pending-action";

// How often a signed-out visitor is invited to sign in. The prompt repeats
// until they do. This opens the same modal the purchase gate uses, so it
// interrupts the page — raise this if it starts to feel like nagging.
const LOGIN_NUDGE_INTERVAL_MS = 30 * 1000;

// Prompting someone to sign in while they are on a sign-in page is noise.
const AUTH_PATHS = ["/login", "/register", "/admin-login"];

const NUDGE_MESSAGE =
  "Sign in to save your favourites, track your orders, and check out faster.";

/** Persist the action the user was attempting so it can resume after login. */
export const readPendingAction = () => {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearPendingAction = () => {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage unavailable — resuming is best-effort */
  }
};

/**
 * Hard gate for purchase/save actions (Buy Now, Add to Cart, Add to Wishlist).
 * Browsing stays completely open; only these actions require an account.
 * The attempted action is stored and replayed once the user signs in.
 */
export const LoginGateProvider = ({ children }) => {
  const [gate, setGate] = useState({ open: false, message: "" });
  const { user, isAuthLoading } = useAuthContext();

  const requireLogin = useCallback(({ message, intent } = {}) => {
    if (intent) {
      try {
        sessionStorage.setItem(PENDING_KEY, JSON.stringify(intent));
      } catch {
        /* non-fatal: the gate still blocks, we just can't resume */
      }
    }
    setGate({ open: true, message });
  }, []);

  const close = useCallback(() => setGate({ open: false, message: "" }), []);

  // Timed nudge. It lives here rather than in a layout because the product
  // page is a separate root route with its own provider — a timer in
  // MainLayout never fired there, which is where customers spend their time.
  useEffect(() => {
    if (user || isAuthLoading) return;

    const timer = setInterval(() => {
      if (AUTH_PATHS.includes(window.location.pathname)) return;
      // Never overwrite a gate the customer actually triggered: replacing a
      // "sign in to complete your purchase" prompt with a generic one would
      // also lose the pending action it is holding.
      setGate((prev) => (prev.open ? prev : { open: true, message: NUDGE_MESSAGE }));
    }, LOGIN_NUDGE_INTERVAL_MS);

    return () => {
      clearInterval(timer);
      // Signing in mid-cycle should take the prompt away immediately, but only
      // if it is the passive nudge — a real purchase gate closes on its own.
      setGate((prev) => (prev.message === NUDGE_MESSAGE ? { open: false, message: "" } : prev));
    };
  }, [user, isAuthLoading]);

  return (
    <LoginGateContext.Provider value={{ requireLogin }}>
      {children}
      <TakeToLoginModal isOpen={gate.open} onClose={close} message={gate.message} />
    </LoginGateContext.Provider>
  );
};

export const useLoginGate = () => {
  const ctx = useContext(LoginGateContext);
  // Fall back to a no-op so a component rendered outside the provider cannot crash.
  return ctx || { requireLogin: () => {} };
};

export default LoginGateContext;
