import React from "react";

const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="text-center my-10 space-y-2">
      <h2
        className="text-4xl md:text-5xl font-bold tracking-wide text-gray-900"
        style={{ fontFamily: "var(--italiana)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-0.5 bg-[var(--pink-gold)] mx-auto mt-3"></div>
    </div>
  );
};

export default SectionTitle;
