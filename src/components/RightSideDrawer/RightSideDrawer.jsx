import React from "react";
import { Link } from "react-router-dom";
import { TfiClose } from "react-icons/tfi";
import { FiTrash2 } from "react-icons/fi";

const RightSideDrawer = ({ showRightDrawer, setShowRightDrawer, cartData, removeFromCart, cartSubtotal }) => {
  if (!showRightDrawer) return null;

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={() => setShowRightDrawer(false)}
      ></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full z-10">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--italiana)" }}>
              Shopping Cart ({cartData?.length || 0})
            </h3>
            <button
              onClick={() => setShowRightDrawer(false)}
              className="p-2 text-gray-500 hover:text-black transition-colors"
            >
              <TfiClose className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartData && cartData.length > 0 ? (
              cartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 border-b pb-4">
                  <img
                    src={item.image || "/logo.png"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-800 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity || 1}</p>
                    <p className="text-sm font-semibold mt-1">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart && removeFromCart(item._id || item.productId)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p>Your shopping bag is empty.</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Subtotal:</span>
              <span>₹{cartSubtotal?.subtotal || 0}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setShowRightDrawer(false)}
              className="block w-full bg-black text-white text-center py-3 uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              onClick={() => setShowRightDrawer(false)}
              className="block w-full border border-black text-black text-center py-3 uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideDrawer;
