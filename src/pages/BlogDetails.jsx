import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogBySlug } from "../lib/blog";
import { 
  Calendar, 
  Clock, 
  Eye, 
  Tag, 
  ChevronRight, 
  AlertCircle, 
  ArrowLeft 
} from "lucide-react";

// Skeleton Loader Component
const BlogDetailsSkeleton = () => {
  return (
    <div className="custom-container py-8 max-w-4xl mx-auto animate-pulse font-['Quicksand']">
      {/* Breadcrumb Skeleton */}
      <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-6"></div>

      {/* Categories Skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>

      {/* Title Skeleton */}
      <div className="h-10 bg-gray-200 rounded-lg w-full mb-3"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-6"></div>

      {/* Meta Bar Skeleton */}
      <div className="flex gap-6 pb-6 mb-8 border-b border-gray-100">
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* Banner Image Skeleton */}
      <div className="aspect-[16/9] w-full bg-gray-200 rounded-2xl mb-8"></div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogBySlug(slug);

        if (data?.success && data?.blog) {
          setBlog(data.blog);
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load blog details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogDetails();
    }
  }, [slug]);

  // Render Skeleton Loader while fetching
  if (loading) {
    return <BlogDetailsSkeleton />;
  }

  // Error UI State
  if (error || !blog) {
    return (
      <div className="custom-container py-16 text-center ">
        <div className="max-w-md mx-auto bg-red-50 border border-red-100 rounded-2xl p-8">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#253D4E] mb-2">
            Oops! Couldn't find that blog
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {error || "The requested article is unavailable."}
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 bg-[#253D4E] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-opacity-90 transition shadow-md"
          >
            <ArrowLeft size={16} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // Date Formatting Helper
  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="custom-container py-8 font-['Quicksand'] max-w-4xl mx-auto">
      {/* Upgraded Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-600 mb-6 overflow-x-auto whitespace-nowrap">
        <Link 
          to="/" 
          className="text-gray-600 hover:text-[#253D4E] hover:underline transition-colors shrink-0"
        >
          Home
        </Link>
        <ChevronRight size={16} className="text-gray-400 shrink-0" />
        <Link 
          to="/blogs" 
          className="text-gray-600 hover:text-[#253D4E] hover:underline transition-colors shrink-0"
        >
          Blogs
        </Link>
        <ChevronRight size={16} className="text-gray-400 shrink-0" />
        <span className="text-[#253D4E] font-extrabold truncate max-w-[200px] sm:max-w-sm">
          {blog.title}
        </span>
      </nav>

      {/* Category Badges */}
      {blog.categories && blog.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.categories.map((cat) => (
            <span
              key={cat._id}
              className="bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-100"
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-4xl font-extrabold text-[#253D4E] leading-tight mb-4">
        {blog.title}
      </h1>

      {/* Meta Bar: Date, Read Time, Views */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 font-bold border-b border-gray-100 pb-6 mb-8">
        <div className="flex items-center gap-1.5">
          <Calendar size={16} className="text-gray-400" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={16} className="text-gray-400" />
          <span>{blog.readTime || 1} min read</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye size={16} className="text-gray-400" />
          <span>{blog.views || 0} Views</span>
        </div>
      </div>

      {/* Featured Banner Image */}
      {blog.image?.url && (
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 border border-gray-100 shadow-sm">
          <img
            src={blog.image.url}
            alt={blog.image.alt || blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Blog Excerpt / Subtitle */}
      {blog.excerpt && (
        <div className="bg-gray-50 border-l-4 border-[#253D4E] p-4 sm:p-5 rounded-r-xl mb-8">
          <p className="text-base sm:text-lg text-[#253D4E] font-medium leading-relaxed italic">
            "{blog.excerpt}"
          </p>
        </div>
      )}

      {/* Dynamic HTML Content Container */}
      <div
        className="
          prose prose-lg max-w-none 
          prose-headings:font-bold prose-headings:!text-black 
          prose-p:!text-black prose-p:leading-relaxed 
          prose-li:!text-black prose-span:!text-black 
          prose-strong:!text-black prose-a:text-emerald-600 
          hover:prose-a:underline prose-img:rounded-xl
          [&_*]:!bg-transparent [&_*]:!text-black
        "
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags Section */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={16} className="text-gray-400 mr-1" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Tags:
            </span>
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100  text-sm  px-3 py-1 rounded-lg border border-gray-200/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;