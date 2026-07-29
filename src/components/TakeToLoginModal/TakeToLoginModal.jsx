import React from "react";
import { Link, useLocation } from "react-router-dom";

const TakeToLoginModal = ({ isOpen, onClose, message }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-body-base">
      <div className="bg-[#F4EADB] rounded-sm shadow-2xl max-w-[400px] w-full p-10 relative animate-fade-in-up text-center border border-[#e2d9ca]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#704c31]/70 hover:text-[#704c31] transition-colors material-symbols-outlined text-[20px]"
        >
          close
        </button>
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Sri Ram Jewellery" className="h-14 w-auto object-contain" />
        </div>
        
        <div className="space-y-4">
          <p className="font-display-lg text-[16px] text-primary uppercase tracking-[0.1em]">
            A Warm Welcome
          </p>
          <h3 className="text-3xl font-display-lg text-on-surface px-4 leading-tight">
            Sign in for a more personal experience
          </h3>
          <p className="text-on-surface-variant text-[13px] font-body-base pb-4 px-2 leading-relaxed">
            {message || "Save your favorites and track orders effortlessly. Enjoy exclusive access to our collections."}
          </p>
          
          <div className="flex flex-col gap-5 items-center pt-2">
            <Link
              to="/login"
              state={{ from: location }}
              onClick={onClose}
              className="w-full bg-primary text-white py-3.5 rounded-sm font-button-text uppercase tracking-[0.2em] text-[11px] hover:bg-primary-container hover:shadow-lg transition-all duration-300 block text-center"
            >
              SIGN-IN/REGISTER
            </Link>
            <button
              onClick={onClose}
              className="text-on-surface-variant font-label-caps uppercase tracking-widest text-[10px] hover:text-primary transition-colors pb-0.5 border-b border-transparent hover:border-primary"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeToLoginModal;
