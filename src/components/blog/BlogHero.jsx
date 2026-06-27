import React from "react";
import { Search } from "lucide-react";

const BlogHero = () => {
  return (
    <div className="bg-[#faf9f6] py-16  border-b border-gray-100">
      <div className="custom-container text-center max-w-3xl mx-auto px-4">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 inline-block">
          PlantPure Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#253D4E]">
          Natural Hair Care Insights & Remedies
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto mb-8">
          Explore our expert guides, traditional herbal secrets, and plant-based
          techniques to achieve radiant, chemical-free hair health.
        </p>
      </div>
    </div>
  );
};

export default BlogHero;
