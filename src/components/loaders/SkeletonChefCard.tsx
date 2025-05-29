import React from "react";

export const SkeletonChefCard: React.FC = () => {
  return (
    <div className="w-64 h-80 bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center animate-pulse flex-shrink-0">
      <div className="w-[100px] h-[100px] bg-gray-300 rounded-full mb-4" />
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-1" />
      <div className="h-4 bg-gray-300 rounded w-1/3" />
    </div>
  );
};
