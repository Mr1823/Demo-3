import React from "react";

const CardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="skeleton h-64 w-full bg-gray-200 animate-pulse rounded-lg"></div>
      <div className="skeleton h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
      <div className="skeleton h-4 w-full bg-gray-200 animate-pulse rounded"></div>
      <div className="skeleton h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
    </div>
  );
};

export default CardSkeleton;
