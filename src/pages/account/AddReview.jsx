import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MessageSquare, ArrowLeft, Loader2, Send } from "lucide-react";
import { getProductById } from "../../lib/product";
import { addReview } from "../../lib/review";
import toast from "react-hot-toast";

const AddReview = () => {
  const { id } = useParams(); // URL parameter se ID li
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product Details fetch karna
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Form Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      toast.error("Please select a star rating!", { position: "bottom-right" });
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({ productId: id, rating, comment });
      toast.success("Review submitted successfully!", {
        duration: 3000,
        position: "bottom-right",
        style: { background: "#253D4E", color: "#fff", fontSize: "14px", fontWeight: "bold", borderRadius: "10px" },
      });
      navigate(-1);
    } catch (err) {
      toast.error(err.message || "Failed to add review", { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-[800px]">
      {/* Header Area */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-black mb-4 transition-all"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Product
      </button>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
        {/* Top Product Info */}
        <div className="bg-gray-50 p-5 flex items-center gap-4">
          <img 
            src={product?.images?.[0]?.url || product?.images?.url} 
            alt={product?.title} 
            className="w-16 h-16 object-cover rounded-xl shadow-sm bg-white" 
          />
          <div>
            <h2 className="font-bold text-gray-800 text-lg leading-tight">{product?.title}</h2>
            <p className="text-gray-400 text-sm italic">Share your experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Rating Stars Section */}
          <div className="flex flex-col items-center sm:mb-0 mb-3">
            <span className="text-gray-700 font-medium mb-2">How would you rate it?</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90 outline-none"
                >
                  <Star
                    size={36}
                    className={`transition-all duration-200 ${
                      (hover || rating) >= star 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && <p className="text-yellow-600 font-semibold mt-2 text-sm">{rating}/5 Stars</p>}
          </div>

          {/* Feedback Input */}
          <div className="mb-6 mt-4">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <MessageSquare size={16} className="mr-2 text-indigo-500" /> Write your feedback
            </label>
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none text-gray-800"
              placeholder="What did you like? What could be better?"
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          {/* Action Button - Using your 'bg-primary' class */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-300"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={18} /> Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;