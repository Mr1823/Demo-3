const STORAGE_KEY = "sri-ram-session-id";

/**
 * A stable per-browser-session id used to deduplicate analytics events.
 *
 * Deliberately in sessionStorage, not localStorage: it should live as long as
 * the tab and no longer. It identifies nothing about the visitor — it exists so
 * one person refreshing a product page is not counted as several viewers.
 */
export const getSessionId = () => {
  try {
    let id = sessionStorage.getItem(STORAGE_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // Private browsing can make sessionStorage throw. Analytics must never be
    // the reason a product page fails to render, so fall back to a throwaway id.
    return `s-ephemeral-${Math.random().toString(36).slice(2, 10)}`;
  }
};
