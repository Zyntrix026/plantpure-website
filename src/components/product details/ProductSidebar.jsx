import React from "react";
import { Link } from "react-router-dom";

const ProductSidebar = () => {
  // Updated data structure to include the display name, count, and the URL slug
  const toolCategories = [
    { name: "Natural Hair", count: 3, slug: "products" },
    { name: "Hair Cleansers", count: 5, slug: "products" },
    { name: "Natural Skin Care", count: 2, slug: "products" },
    { name: "Hair Seram and Oils", count: 3, slug: "products" },
    
  ];

  return (
    <div className="hidden lg:block lg:basis-[250px] shrink-0 space-y-8">
      {/* Category List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-[#253D4E]">Categories</h3>

        {/* Underline Decoration */}
        <div className="relative mt-2 mb-4">
          <div className="h-px bg-gray-100 w-full"></div>
          <div className="absolute top-0 left-0 h-px w-14 bg-[#FFEABE]"></div>
        </div>

        <div className="space-y-2">
          {toolCategories.map((item, i) => (
            <Link
              key={i}
              to={`/${item.slug}`}
              className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-lg hover:border-[#FFEABE] hover:bg-gray-50 transition-all cursor-pointer group"
            >
              <span className="text-sm font-semibold text-gray-600 group-hover:text-[#253D4E]">
                {item.name}
              </span>
              <span className="w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full bg-[#FFEABE] text-[#253D4E]">
                {item.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSidebar;
