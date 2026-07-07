import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  ArrowRight,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getPublishedBlogs } from "../../lib/blog.js";
import { Link } from "react-router-dom";

const BlogSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 flex flex-col animate-pulse">
      <div className="h-48 sm:h-56 bg-gray-200 w-full" />
      
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <div className="flex gap-4 mb-4">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        
        <div className="h-5 bg-gray-200 rounded w-5/6 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-4" />
        
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-4/5 mb-6" />
        
        <div className="mt-auto h-4 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
};

// --- 2. Main BlogGrid Component ---
const BlogGrid = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    totalBlogs: 0,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getPublishedBlogs(currentPage);

        setBlogs(data.blogs || []);

        if (data.pagination) {
          setPaginationInfo({
            totalPages: data.pagination.totalPages,
            hasNext: data.pagination.hasNext,
            hasPrev: data.pagination.hasPrev,
            totalBlogs: data.pagination.totalBlogs,
          });
        }
      } catch (err) {
        setError(err.message || "Something went wrong while fetching blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (paginationInfo.hasPrev) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (paginationInfo.hasNext) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Error State
  if (error) {
    return (
      <div className="py-24 text-center text-red-500 font-medium bg-white">
        <div className="max-w-md mx-auto p-6 border-2 border-red-100 rounded-2xl">
          <p className="mb-4">Error: {error}</p>
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State (सिर्फ तब दिखेगा जब लोडिंग खत्म हो चुकी हो और कोई ब्लॉग न मिले)
  if (!loading && blogs.length === 0) {
    return (
      <div className="py-24 text-center text-gray-500 font-medium bg-white">
        No blogs found.
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="custom-container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* अगर लोडिंग सच है, तो 6 स्केलेटन कार्ड्स दिखाओ, नहीं तो असली ब्लॉग लिस्ट */}
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <BlogSkeleton key={index} />
              ))
            : blogs.map((blog) => {
                const formattedDate = new Date(blog.publishedAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                );

                const categoryName =
                  blog.categories && blog.categories.length > 0
                    ? blog.categories[0].name
                    : "General";

                return (
                  <div
                    key={blog._id}
                    className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-emerald-600/20 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    {/* Blog Image */}
                    <div className="h-48 sm:h-56 overflow-hidden relative bg-gray-100">
                      <span className="absolute top-4 left-4 z-10 bg-emerald-600 text-white font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full shadow-sm">
                        {categoryName}
                      </span>
                      <img
                        src={blog.image?.url}
                        alt={blog.image?.alt || blog.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/600x400/eceff1/253d4e?text=PlantPure+Hair+Care";
                        }}
                      />
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400 text-[11px] sm:text-xs font-bold mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-emerald-600" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-emerald-600" />
                          <span>{blog.author?.name || "PlantPure"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-emerald-600" />
                          <span>{blog.readTime} min read</span>
                        </div>
                        {blog.views > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Eye size={13} className="text-emerald-600" />
                            <span>{blog.views} views</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#253D4E] leading-snug mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      <Link to={`/blogs/${blog.slug}`} className="mt-auto flex items-center gap-2 text-xs sm:text-sm font-bold text-[#253D4E] group-hover:text-emerald-600 group-hover:underline transition-all">
                        <span>Read Article</span>
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Pagination Controls - लोडिंग के दौरान इसे छुपा कर रखेंगे */}
        {!loading && paginationInfo.totalPages > 1 && (
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Showing page{" "}
              <span className="text-[#253D4E] font-bold">{currentPage}</span> of{" "}
              <span className="text-[#253D4E] font-bold">
                {paginationInfo.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={!paginationInfo.hasPrev}
                className={`p-2 rounded-xl border-2 font-bold text-sm flex items-center gap-1 transition-all ${
                  paginationInfo.hasPrev
                    ? "border-gray-200 text-[#253D4E] hover:border-emerald-600 hover:text-emerald-600 cursor-pointer"
                    : "border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline pr-1">Previous</span>
              </button>

              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl border border-emerald-200">
                {currentPage}
              </span>

              <button
                onClick={handleNextPage}
                disabled={!paginationInfo.hasNext}
                className={`p-2 rounded-xl border-2 font-bold text-sm flex items-center gap-1 transition-all ${
                  paginationInfo.hasNext
                    ? "border-gray-200 text-[#253D4E] hover:border-emerald-600 hover:text-emerald-600 cursor-pointer"
                    : "border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <span className="hidden sm:inline pl-1">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogGrid;