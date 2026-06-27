import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

const ProductImageGallery = ({ images }) => {
  const [active, setActive] = useState(images[0]?.url);

  useEffect(() => {
    if (images.length > 0) setActive(images[0].url);
  }, [images]);
  

  return (
    <div className="lg:basis-[450px] flex-shrink-0">
      
      {/* Main Large Image */}
      <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img
          src={active}
          alt="Product"
          className="w-full h-[360px] object-contain"
        />
      
      </div>

      {/* Thumbnails Wrapper */}
      {/* Humne yahan 'flex-wrap' use kiya hai taaki images line se aayein aur 'flex-1' hata diya hai */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-6">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(img.url)}
            // 'flex-1' ko hata kar fixed width 'w-20' ya 'w-24' di hai
            className={`border rounded-lg p-1 sm:p-2 w-20 sm:w-24 h-20 sm:h-24 transition-all overflow-hidden ${
              active === img.url 
                ? "border-secondary ring-1 ring-secondary shadow-sm" 
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={img.url}
              alt={img.alt || "thumbnail"}
              className="w-full h-full object-cover rounded-md"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;