import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Calendar, Loader2, AlertTriangle } from "lucide-react";
import { getProductReviews } from "../../lib/review";

const ProductReview = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getProductReviews(productId);
        if (data.success) {
          setReviews(data.reviews || []);
          setCount(data.count || 0);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // Date Formatting Helper Function (e.g., 18 May 2026)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Average Rating Calculator logic
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 font-['Quicksand'] text-[#253D4E]">
        <Loader2 size={32} className="animate-spin mb-2 text-secondary" />
        <p className="text-sm font-bold">Loading product reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-['Quicksand'] max-w-xl mx-auto my-6 border border-red-100">
        <AlertTriangle size={20} />
        <span className="text-sm font-bold">{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full font-['Quicksand'] text-[#253D4E] mt-8">
      {/* Header Summary Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            Customer Reviews <span className="text-sm bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-black">{count}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">Verified ratings from genuine customers</p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100 w-fit">
            <div className="text-center">
              <span className="text-2xl font-black">{calculateAverageRating()}</span>
              <span className="text-xs text-gray-400 font-bold block">out of 5</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={`${
                      i < Math.round(calculateAverageRating()) ? "text-amber-400 fill-amber-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-500 font-bold block mt-0.5">Overall Store Rating</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Reviews Listing Grid */}
      {reviews.length === 0 ? (
        <div className="text-center p-12 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
          <MessageSquare size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-500">No reviews yet for this product</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts with others!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md/5 transition-all duration-200"
            >
              {/* User Meta Data & Rating Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={review.userId?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={review.userId?.name || "Anonymous User"}
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-gray-50"
                  />
                  <div>
                    <h4 className="text-sm font-black text-[#253D4E]">
                      {review.userId?.name || "Anonymous User"}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={`${
                              i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded font-black">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date Stamp block */}
                <div className="flex items-center gap-1 text-gray-400 text-xs font-bold sm:self-start mt-1 sm:mt-0">
                  <Calendar size={12} />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>

              {/* User Comment Feedback Block */}
              <div className="pl-0 sm:pl-13 mt-2">
                <p className="text-[14px] text-[#253D4E]/80 leading-relaxed font-medium bg-gray-50/40 p-3 rounded-xl border border-gray-50">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReview;