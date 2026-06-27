import React from "react";
import { Calendar, User, ArrowRight } from "lucide-react";

const BlogGrid = () => {
  // PlantPure की थीम पर आधारित 5 वर्किंग ब्लॉग डेटा इमेज और अपडेटेड ऑथर के साथ
  const blogs = [
    {
      id: 1,
      title: "The Ultimate Guide to Chemical-Free Hair Coloring at Home",
      excerpt: "Discover how traditional herbal blends can give you vibrant color and deep conditioning without a single drop of ammonia or parabens.",
      image: "https://images.pexels.com/photos/3762882/pexels-photo-3762882.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "June 22, 2026",
      author: "PlantPure",
      category: "Natural Color"
    },
    {
      id: 2,
      title: "5 Plant-Based Ingredients to Stop Hair Fall Naturally",
      excerpt: "Say goodbye to synthetic hair fall treatments. Learn how time-tested botanical extracts restore follicle strength from root to tip.",
      image: "https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "June 18, 2026",
      author: "PlantPure",
      category: "Hair Growth"
    },
    {
      id: 3,
      title: "Understanding Scalp Detox: Why Clean Care Matters",
      excerpt: "Years of commercial shampoos can leave chemical residue on your scalp. Here is how simple plant cleansers clarify without stripping oils.",
      image: "https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "June 12, 2026",
      author: "PlantPure",
      category: "Scalp Health"
    },
    {
      id: 4,
      title: "How to Keep Your Scalp Hydrated During Harsh Summers",
      excerpt: "Dry heat can lead to brittle textures and itchiness. Unlock the moisturizing benefits of cold-pressed oils and pure herbal liquids.",
      image: "https://images.pexels.com/photos/3616876/pexels-photo-3616876.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "June 05, 2026",
      author: "PlantPure",
      category: "Moisturization"
    },
    {
      id: 5,
      title: "The Transition: Moving from Synthetic Shampoos to PlantPure",
      excerpt: "What to expect when your hair unlearns chemical treatments and embraces pure botanical harmony. A complete week-by-week guide.",
      image: "https://images.pexels.com/photos/3735605/pexels-photo-3735605.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "May 29, 2026",
      author: "PlantPure",
      category: "Sustainable Beauty"
    }
  ];

  return (
    <div className="py-16 bg-white ">
      <div className="custom-container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-emerald-600/20 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Blog Image Container */}
              <div className="h-48 sm:h-56 overflow-hidden relative bg-gray-100">
                <span className="absolute top-4 left-4 z-10 bg-emerald-600 text-white font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full shadow-smLimiter">
                  {blog.category}
                </span>
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // अगर कोई इमेज फिर भी लोड न हो तो बैकअप सॉलिड कलर या प्लेसहोल्डर दिखेगा
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/600x400/eceff1/253d4e?text=PlantPure+Hair+Care";
                  }}
                />
              </div>

              {/* Blog Details */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                {/* Meta Details */}
                <div className="flex items-center gap-4 text-gray-400 text-[11px] sm:text-xs font-bold mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-emerald-600" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-emerald-600" />
                    <span>{blog.author}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-[#253D4E] leading-snug mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* Read More Link Button CTA */}
                <button className="mt-auto flex items-center gap-2 text-xs sm:text-sm font-bold text-[#253D4E] group-hover:text-emerald-600 group-hover:underline transition-all">
                  <span>Read Article</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;