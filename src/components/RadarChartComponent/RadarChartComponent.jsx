import React from "react";

const RadarChartComponent = ({ data }) => {
  return (
    <div className="w-full h-64 bg-gray-50 rounded-lg flex flex-col items-center justify-center p-4 border border-dashed border-gray-300">
      <svg className="w-40 h-40 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
      <p className="text-xs text-gray-500 mt-2 font-medium">Category Distribution Radar Chart</p>
    </div>
  );
};

export default RadarChartComponent;
