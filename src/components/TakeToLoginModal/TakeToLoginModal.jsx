import React from "react";
import { Link, useLocation } from "react-router-dom";
import { TfiClose } from "react-icons/tfi";

const TakeToLoginModal = ({ isOpen, onClose, message = "Please log in to continue" }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <TfiClose className="text-lg" />
        </button>
        <div className="text-center space-y-4 pt-2">
          <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--italiana)" }}>
            Authentication Required
          </h3>
          <p className="text-gray-600 text-sm">{message}</p>
          <div className="pt-4 flex flex-col gap-3">
            <Link
              to="/login"
              state={{ from: location }}
              onClick={onClose}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors block text-center"
            >
              Log In
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors block text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeToLoginModal;
