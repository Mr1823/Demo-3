import React from "react";

const BarChartComponent = ({ data }) => {
  return (
    <div className="w-full h-64 bg-gray-50 rounded-lg flex flex-col items-center justify-center p-4 border border-dashed border-gray-300">
      <svg className="w-40 h-40 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p className="text-xs text-gray-500 mt-2 font-medium">Monthly Revenue Bar Chart</p>
    </div>
  );
};

export default BarChartComponent;
