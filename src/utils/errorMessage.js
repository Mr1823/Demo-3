/**
 * Safely reduce anything thrown by axios/fetch/our API into a plain string.
 *
 * Rendering a raw error object in JSX throws React error #31 ("Objects are not
 * valid as a React child") and unmounts the whole tree — which surfaces as the
 * router's error page. Always pass errors through this before putting them in
 * state that gets rendered.
 */
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  const candidates = [
    error?.response?.data?.error,
    error?.response?.data?.message,
    error?.error,
    error?.message,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate;
    // Some APIs nest the human-readable text one level deeper, e.g. { error: { code, message } }
    if (candidate && typeof candidate === "object" && typeof candidate.message === "string") {
      return candidate.message;
    }
  }

  return fallback;
};
