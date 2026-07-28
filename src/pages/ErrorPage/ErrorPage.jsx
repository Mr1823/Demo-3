import React from "react";
import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <main className="min-h-screen bg-surface flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-section-gap-lg">
      <div className="max-w-2xl w-full text-center animate-fade-in-up visible">
        {/* Large Serif 404 */}
        <div className="mb-8">
          <h1 className="font-display-lg text-[120px] md:text-[180px] leading-none text-primary/20 select-none">
            {error?.status || 404}
          </h1>
        </div>

        {/* Content Grouping */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-label-caps text-label-caps text-secondary tracking-[0.2em] uppercase">
              PAGE NOT FOUND
            </p>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              This page has wandered off
            </h2>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
            Even the finest treasures can sometimes be misplaced. Let us guide you back to our curation.
          </p>

          {error?.error?.message && (
            <p className="font-body-base text-error-crimson text-sm mt-2 italic">
              {error.error.message}
            </p>
          )}

          {/* CTA */}
          <div className="pt-8">
            <Link
              to="/"
              className="inline-block bg-primary-container text-on-primary-container font-button-text text-button-text px-10 py-4 rounded-none hover:scale-[1.02] transition-transform duration-300 active:bg-primary cursor-pointer"
            >
              RETURN TO SHOP
            </Link>
          </div>
        </div>

        {/* Decorative flourish */}
        <div className="mt-16 flex justify-center">
          <div className="w-16 h-[1px] bg-outline-variant/60"></div>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
