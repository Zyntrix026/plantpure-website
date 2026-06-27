import React from "react";

const SkeletonProduct = () => (
  <div className="bg-white rounded-xl border-2 border-gray-100 p-3 flex flex-col animate-pulse">
    <div className="h-[180px] bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="flex justify-between items-center mt-auto">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);
export default SkeletonProduct;
