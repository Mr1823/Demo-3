import React, { createContext, useContext, useState, useCallback } from "react";
import TakeToLoginModal from "../components/TakeToLoginModal/TakeToLoginModal";

const LoginGateContext = createContext(null);

const PENDING_KEY = "sri-ram-pending-action";

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
