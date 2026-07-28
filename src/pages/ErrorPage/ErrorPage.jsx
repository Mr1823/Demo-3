import React from "react";
import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-background font-body px-5 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04] select-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[200px] bg-secondary"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[180px] bg-primary"></div>
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* Large 404 Display */}
        <h1 className="font-display text-[120px] md:text-[180px] leading-none text-primary/20 font-bold select-none">
          {error?.status || 404}
        </h1>

        {/* Decorative gold line */}
        <div className="w-16 h-[1px] bg-secondary mx-auto mb-8 -mt-4"></div>

        {/* Message */}
        <h2 className="font-display text-3xl md:text-4xl text-heading-espresso mb-4">
          Page Not Found
        </h2>
        <p className="font-body text-on-surface-variant text-sm leading-relaxed mb-2">
          The piece you're looking for may have been moved to another collection,
          or perhaps the path was lost along the way.
        </p>
        {error?.error?.message && (
          <p className="font-body text-error-crimson text-xs mt-2 italic">
            {error.error.message}
          </p>
        )}

        {/* CTA */}
        <Link 
          to="/"
          className="mt-10 inline-block px-10 py-4 bg-primary text-white font-body text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-500 transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
        >
          Return to Home
        </Link>

        {/* Secondary link */}
        <div className="mt-6">
          <Link
            to="/shop"
            className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
