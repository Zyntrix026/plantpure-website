import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

// Import your API function from its module
import { getReviews } from "../lib/googleReview.js";

const ITEMS_PER_PAGE = 6;

// Skeleton Loader Component for Review Cards
const ReviewSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between animate-pulse">
    <div>
      {/* Header Skeleton */}
      <div className="flex items-center gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
      </div>

      {/* Stars Skeleton */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
        ))}
      </div>

      {/* Comment Lines Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>

    {/* Badge Skeleton */}
    <div className="pt-3 border-t border-gray-50 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-gray-200" />
      <div className="h-3 bg-gray-200 rounded w-24" />
    </div>
  </div>
);

const CustomerReview = () => {
  // Data States
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Filtering & Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await getReviews();

      if (response && response.success !== false) {
        // Extract array from response payload
        const reviewsData = Array.isArray(response)
          ? response
          : response.data || [];

        setReviews(reviewsData);

        // Dynamically set stats from API response or calculate on the fly
        const total = response.totalReviews ?? reviewsData.length;
        const avg =
          response.averageRating ??
          (reviewsData.length > 0
            ? (
                reviewsData.reduce((acc, item) => acc + (item.rating || 0), 0) /
                reviewsData.length
              ).toFixed(1)
            : 0);

        setStats({
          averageRating: Number(avg) || 0,
          totalReviews: total,
        });
      } else {
        setErrorMsg(response?.message || "Failed to load customer reviews.");
      }
    } catch (err) {
      setErrorMsg("An unexpected network error occurred while fetching reviews.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Client-Side Star Filter
  const filteredReviews = useMemo(() => {
    if (selectedFilter === "all") return reviews;
    return reviews.filter((r) => r.rating === Number(selectedFilter));
  }, [reviews, selectedFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE) || 1;
  const currentReviews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredReviews]);

  // Helper: Format Date String
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime())
      ? dateStr
      : parsed.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  // Helper: First Letter Avatar Placeholder
  const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : "?");

  // Filter Reset Handler
  const handleFilterChange = (star) => {
    setSelectedFilter(star);
    setCurrentPage(1);
  };

  return (
    <div className="custom-container min-h-screen py-10 px-4 max-w-7xl mx-auto bg-gray-50/50">
      
      {/* Header & Rating Breakdown Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
            <p className="text-gray-500 mt-1">
              See what our verified buyers have to say about our products.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-amber-50/60 border border-amber-100 p-4 rounded-xl shrink-0">
            <div className="text-center">
              <span className="text-4xl font-extrabold text-amber-600">
                {isLoading ? "--" : stats.averageRating || "0.0"}
              </span>
              <span className="text-xs text-gray-500 block font-medium">out of 5</span>
            </div>
            <div className="h-10 w-[1px] bg-amber-200"></div>
            <div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(stats.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-1 font-medium">
                Based on {stats.totalReviews} verified reviews
              </p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-gray-100">
          <span className="text-sm text-gray-500 font-medium mr-2">Filter by:</span>
          {["all", "5", "4", "3", "2", "1"].map((star) => (
            <button
              key={star}
              onClick={() => handleFilterChange(star)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === star
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {star === "all" ? "All Reviews" : `${star} Stars`}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={fetchReviews}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Render 6 Skeleton Cards during API load
          [...Array(6)].map((_, index) => <ReviewSkeleton key={index} />)
        ) : currentReviews.length > 0 ? (
          currentReviews.map((review) => {
            const reviewId = review._id || review.id;
            return (
              <div
                key={reviewId}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Customer Avatar, Name & Date */}
                  <div className="flex items-center gap-3.5 mb-4">
                    {review.image ? (
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-inner shrink-0">
                        {getInitial(review.name)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">
                        {review.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {formatDate(review.createdAt || review.date)}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-100 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                </div>

                {/* Verified Buyer Badge */}
                <div className="pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {review.isVerifiedBuyer !== false ? "Verified Buyer" : "Customer Review"}
                </div>
              </div>
            );
          })
        ) : null}
      </div>

      {/* Empty State */}
      {!isLoading && filteredReviews.length === 0 && !errorMsg && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 font-medium">No reviews found for this rating.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-10 bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">
            Showing Page <span className="font-semibold text-gray-800">{currentPage}</span> of{" "}
            <span className="font-semibold text-gray-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Numeric Page Buttons */}
            <div className="hidden sm:flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 text-sm font-medium rounded-lg transition ${
                      currentPage === page
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReview;