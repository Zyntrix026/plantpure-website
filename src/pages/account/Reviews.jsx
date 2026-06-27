import React, { useState, useEffect } from 'react';
import { Star, Trash2, Edit3, MessageSquare, AlertTriangle, X, Loader2, Send } from 'lucide-react';
import { deleteReview, getMyReview, updateReview } from '../../lib/review'; 
import { useParams, useNavigate } from 'react-router-dom';

// --- Skeleton Loader ---
const ReviewSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 animate-pulse">
    <div className="flex gap-4">
      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
    <div className="mt-4 h-12 bg-gray-50 rounded-lg"></div>
  </div>
);

// --- Delete Modal ---
const DeleteModal = ({ isOpen, onClose, onConfirm, loading, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertTriangle size={24} /></div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title || "Confirm Delete"}</h3>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button disabled={loading} onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
          <button disabled={loading} onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:bg-red-600 transition-all disabled:opacity-50">
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Update Review Modal ---
const UpdateModal = ({ isOpen, onClose, onConfirm, loading, initialData }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating);
      setComment(initialData.comment);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[9999999] p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Update Review</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>

        <div className="space-y-6">
          {/* Rating Stars */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-slate-600 mb-2">How would you rate it now?</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      (hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Box */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Edit your feedback</label>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none text-sm"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            onClick={() => onConfirm({ rating, comment })}
            disabled={loading || !rating || !comment}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Update Now</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [updateModal, setUpdateModal] = useState({ open: false, data: null });

  const fetchMyReview = async () => {
    try {
      const res = await getMyReview();
      setReviews(res.data || []); 
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyReview(); }, []);

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteReview(deleteModal.id);
      setReviews(reviews.filter((r) => r._id !== deleteModal.id));
      setDeleteModal({ open: false, id: null });
    } catch (error) { alert(error.message); }
    finally { setActionLoading(false); }
  };

  const handleUpdate = async (updatedData) => {
    setActionLoading(true);
    try {
      await updateReview(updateModal.data._id, updatedData);
      // Local state update karein
      setReviews(reviews.map(r => r._id === updateModal.data._id ? { ...r, ...updatedData } : r));
      setUpdateModal({ open: false, data: null });
    } catch (error) { alert(error.message); }
    finally { setActionLoading(false); }
  };

  if (loading) return (
    <div className="max-w-[800px]">
      {[1, 2, 3, 4].map(i => <ReviewSkeleton key={i} />)}
    </div>
  );

  return (
    <div className="max-w-[800px]">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Product Feedback</h1>
        <p className="text-sm text-slate-500">View and manage your submitted reviews</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
           <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
           <p className="text-gray-500 font-medium">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((item) => (
            <div key={item._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  <img src={item.product?.thumbnail} alt="product" className="w-16 h-16 object-cover rounded-xl bg-gray-50 border border-gray-100" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">{item.product?.title}</h3>
                    <div className="flex items-center gap-1 mt-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < item.rating ? "fill-current" : "text-gray-200"} />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setUpdateModal({ open: true, data: item })}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => setDeleteModal({ open: true, id: item._id })}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-slate-50 rounded-xl relative">
                <p className="text-slate-600 text-sm italic">"{item.comment}"</p>
                {!item.isActive && (
                  <span className="absolute top-2 right-2 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">
                    Moderation Pending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <DeleteModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Delete Review?"
        message="This will permanently remove your feedback."
      />

      <UpdateModal 
        isOpen={updateModal.open}
        initialData={updateModal.data}
        onClose={() => setUpdateModal({ open: false, data: null })}
        onConfirm={handleUpdate}
        loading={actionLoading}
      />
    </div>
  );
};

export default Reviews;