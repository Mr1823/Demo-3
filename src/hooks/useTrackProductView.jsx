import { useEffect, useRef } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { getSessionId } from "../utils/sessionId";

/**
 * Records one product-detail view.
 *
 * Fires through axiosSecure so a signed-in visitor's view is attributed to
 * them, but the endpoint itself is public — guests browse freely and their
 * views count too.
 *
 * Two layers stop a single visit being counted twice: a ref guard here (React
 * StrictMode invokes effects twice in development, and the id can change
 * without the component unmounting), and a 30-minute per-session dedupe window
 * on the server, which is the one that actually holds since the client is not
 * trusted.
 */
const useTrackProductView = (productId) => {
  const [axiosSecure] = useAxiosSecure();
  const trackedIdRef = useRef(null);

  useEffect(() => {
    if (!productId || trackedIdRef.current === productId) return;

    // Claim this id before awaiting, so StrictMode's immediate second
    // invocation sees it already taken rather than racing the request.
    trackedIdRef.current = productId;

    axiosSecure
      .post(`/products/${productId}/view`, { sessionId: getSessionId() })
      .catch(() => {
        // Analytics is best-effort: a failed view must never surface to the
        // customer or block the page. Allow a later attempt for this id.
        if (trackedIdRef.current === productId) {
          trackedIdRef.current = null;
        }
      });
  }, [productId, axiosSecure]);
};

export default useTrackProductView;
