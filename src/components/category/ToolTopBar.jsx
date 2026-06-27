import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, SortAsc, SortDesc, Clock } from "lucide-react";

const ToolTopBar = ({ sortLabel, setSortLabel, setSort, totalProducts, setSearchTerm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, setSearchTerm]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-[#f8f9fa] p-4 rounded-2xl border border-gray-100">
      <div className="order-2 lg:order-1 flex items-center">
        <p className="text-[15px] text-gray-500 font-medium">
          We found <span className="text-primary font-bold text-lg">{totalProducts}</span> items for you!
        </p>
      </div>

      <div className="order-1 lg:order-2 flex-1 max-w-xl mx-auto w-full">
        <div className="relative group">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for products..." 
            className="w-full pl-6 pr-28 py-3.5 bg-white border-2 border-transparent shadow-sm rounded-xl outline-none focus:border-primary transition-all placeholder:sm:text-base placeholder:text-sm" 
          />
          <button className="absolute right-2 top-2 bottom-2 bg-primary text-white sm:px-5 px-2 rounded-lg sm:font-bold font-semibold flex items-center gap-2">
            <Search className="text-white" size={18} />
            <span className="sm:text-base text-sm">Search</span>
          </button>
        </div>
      </div>

      <div className="order-3 flex justify-end">
        <div className="relative w-full sm:w-[250px]">
          <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Sort:</span>
              <span className="text-sm font-bold text-gray-800">{sortLabel}</span>
            </div>
            <ChevronDown size={18} />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-full bg-white border rounded-xl shadow-2xl z-50 overflow-hidden">
              {[
                { label: "Newest Arrivals", value: "newest", icon: <Clock size={14} /> },
                { label: "Price: Low to High", value: "price_asc", icon: <SortAsc size={14} /> },
                { label: "Price: High to Low", value: "price_desc", icon: <SortDesc size={14} /> }
              ].map((opt) => (
                <button 
                  key={opt.value} 
                  onClick={() => { setSortLabel(opt.label); setSort(opt.value); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 font-semibold"
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ToolTopBar;