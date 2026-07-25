import React from "react";
import { Link } from "react-router-dom";
import { TfiClose } from "react-icons/tfi";

const RightSideDrawer = ({ showRightDrawer, setShowRightDrawer, cartData, removeFromCart, cartSubtotal }) => {
  if (!showRightDrawer) return null;

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden font-body-base">
      <div
        className="absolute inset-0 bg-[#353026]/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setShowRightDrawer(false)}
      ></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-background shadow-xl flex flex-col h-full z-10 border-l border-[#c8a684]/30">
          
          <div className="p-6 border-b border-[#c8a684]/30 flex items-center justify-between bg-surface-container-low">
            <h3 className="text-2xl text-on-surface" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Shopping Bag ({cartData?.length || 0})
            </h3>
            <button
              onClick={() => setShowRightDrawer(false)}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-[#ebe1d2]"
            >
              <TfiClose className="text-lg" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartData && cartData.length > 0 ? (
              cartData.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b border-[#c8a684]/20 pb-6 group">
                  <div className="w-24 h-24 shrink-0 border border-[#c8a684]/30 overflow-hidden bg-[#fcf2e3]">
                    <img
                      src={item.image || item.img || "/logo.png"}
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-semibold text-base text-on-surface line-clamp-2" style={{fontFamily: "'Cormorant Garamond', serif"}}>{item.name}</h4>
                      <p className="text-xs text-on-surface-variant mt-1 font-label-caps uppercase tracking-widest">Qty: {item.quantity || 1}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-semibold text-primary">₹{(item.price || item.discountPrice)?.toLocaleString('en-IN')}</p>
                      <button
                        onClick={() => removeFromCart && removeFromCart(item._id || item.productId)}
                        className="text-on-surface-variant hover:text-[#93000a] text-xs font-label-caps uppercase tracking-widest flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 flex flex-col items-center gap-4 text-on-surface-variant opacity-60">
                 <span className="material-symbols-outlined text-5xl">shopping_bag</span>
                <p style={{fontFamily: "'Cormorant Garamond', serif"}} className="text-xl">Your shopping bag is empty.</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-[#c8a684]/30 bg-[#fcf2e3] space-y-6">
            <div className="flex justify-between items-center text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-semibold text-on-surface">₹{(cartSubtotal?.subtotal || 0).toLocaleString('en-IN')}</span>
            </div>
            
            <p className="text-xs text-on-surface-variant text-center -mt-4">
              Taxes and shipping calculated at checkout
            </p>

            <div className="space-y-3">
              <Link
                to="/checkout"
                onClick={() => setShowRightDrawer(false)}
                className="block w-full bg-[#704c31] text-white text-center py-4 font-button-text text-sm font-semibold uppercase tracking-widest hover:bg-[#5b3d27] transition-colors"
              >
                Checkout
              </Link>
              <Link
                to="/shop"
                onClick={() => setShowRightDrawer(false)}
                className="block w-full border border-[#704c31] text-[#704c31] text-center py-4 font-button-text text-sm font-semibold uppercase tracking-widest hover:bg-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideDrawer;
