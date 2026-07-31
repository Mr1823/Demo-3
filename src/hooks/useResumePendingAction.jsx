import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthContext from "./useAuthContext";
import useCart from "./useCart";
import useWishlist from "./useWishlist";
import useProducts from "./useProducts";
import { readPendingAction, clearPendingAction } from "../context/LoginGateContext";

/**
 * Replays the action a visitor attempted before being asked to sign in, so the
 * login gate costs them a sign-in rather than their place in the flow.
 * Mounted once per layout; guarded so it can only fire a single time.
 */
const useResumePendingAction = () => {
  const { user, isAuthLoading } = useAuthContext();
  const { addToCart } = useCart();
  const [, , , addToWishlist] = useWishlist();
  const [products] = useProducts();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (isAuthLoading || !user || hasRun.current) return;

    const pending = readPendingAction();
    if (!pending) return;

    // Every intent needs the product record to rebuild its payload, so wait for
    // the catalogue rather than consuming the intent and silently doing nothing.
    if (!products?.length) return;

    const product = products.find(
      (p) => p._id === pending.productId || p.productId === pending.productId
    );
    if (!product) return;

    hasRun.current = true;
    clearPendingAction();

    if (pending.type === "buyNow") {
      navigate("/checkout", {
        state: {
          buyNow: {
            productId: product.productId || product._id,
            name: product.name,
            img: product.img || product.images?.[0],
            category: product.category,
            price: product.discountPrice || product.price,
            quantity: pending.quantity || 1,
          },
        },
      });
      return;
    }

    if (pending.type === "cart") {
      addToCart(product, pending.quantity || 1);
      toast.success("Added to your bag");
    } else if (pending.type === "wishlist") {
      addToWishlist(product);
    }
  }, [user, isAuthLoading, products, addToCart, addToWishlist, navigate]);
};

export default useResumePendingAction;
