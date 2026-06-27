import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, MapPin, CreditCard, Loader2, XCircle, X, AlertTriangle, RefreshCcw, AlertOctagon } from "lucide-react";
import { getOrderById, requestCancellation } from "../lib/order";
import { toast } from "react-hot-toast";

const CANCELLABLE_DELIVERY = new Set(["pending", "confirmed", "processing"]);
const CANCELLABLE_PICKUP   = new Set(["pending", "confirmed", "processing", "ready_for_pickup"]);

// Helper logic aligned with Orders page (hides button if requested or rejected)
const isCancellable = (order) => {
  if (!order || ["cancelled", "delivered", "picked_up"].includes(order.orderStatus)) return false;
  if (order.cancellationStatus && ["pending", "rejected"].includes(order.cancellationStatus)) return false;
  
  const set = order.shippingMethod === "store_pickup" ? CANCELLABLE_PICKUP : CANCELLABLE_DELIVERY;
  return set.has(order.orderStatus);
};

const OrderConfirmation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason]       = useState("");
  const [cancelLoading, setCancelLoading]     = useState(false);

  const handleCancelConfirm = async () => {
    setCancelLoading(true);
    try {
      const res = await requestCancellation(order._id, cancelReason);
      if (res.success) {
        toast.success("Cancellation request sent to admin.");
        setShowCancelModal(false);
        setOrder((prev) => ({
          ...prev,
          cancellationStatus: "pending",
          orderStatus: res.data?.orderStatus || prev.orderStatus, 
          paymentStatus: res.data?.paymentStatus || prev.paymentStatus,
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send cancellation request");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <XCircle size={48} className="text-red-500" />
        <p className="text-gray-500 font-medium">{error || "Order not found"}</p>
        <Link to="/" className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition">Go Home</Link>
      </div>
    );
  }

  const STATUS_COLORS = {
    pending:          "bg-yellow-100 text-yellow-700",
    confirmed:        "bg-blue-100 text-blue-700",
    processing:       "bg-sky-100 text-sky-700",
    shipped:          "bg-indigo-100 text-indigo-700",
    out_for_delivery: "bg-purple-100 text-purple-700",
    delivered:        "bg-green-100 text-green-700",
    ready_for_pickup: "bg-fuchsia-100 text-fuchsia-700",
    picked_up:        "bg-teal-100 text-teal-700",
    cancelled:        "bg-red-100 text-red-600",
  };

  const PAYMENT_COLORS = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-600",
    refunded: "bg-emerald-100 text-emerald-700"
  };

  return (
    <div className="min-h-screen bg-white/60 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Success / Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-2">
          {isSuccess ? (
            <CheckCircle size={52} className="text-green-500 mx-auto" />
          ) : (
            <Package size={52} className="text-primary mx-auto" />
          )}
          <h1 className="text-2xl font-bold text-primary">
            {isSuccess ? "Order Placed Successfully!" : "Order Details"}
          </h1>
          <p className="text-gray-400 text-sm">
            Order <span className="font-bold text-primary">#{order.orderNumber}</span>
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
              {order.orderStatus?.toUpperCase()}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${PAYMENT_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
              {order.paymentStatus?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Cancellation Status: Rejected Alerts */}
        {order.cancellationStatus === "rejected" && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 items-start">
            <AlertOctagon className="text-rose-600 shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="text-rose-800 font-bold">Cancellation Request Rejected</p>
              {order.cancellationRejectionReason && (
                <p className="text-rose-700 mt-0.5 italic">
                  Reason: "{order.cancellationRejectionReason}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* Cancellation Status: Pending Alerts */}
        {order.cancellationStatus === "pending" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 font-medium flex items-center gap-2">
            ⏳ Cancellation request is under review by our team.
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-primary flex items-center gap-2"><Package size={16} /> Items Ordered</h2>
          <div className="space-y-3">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex gap-3 items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-contain bg-gray-50 rounded-md border border-gray-100 p-1" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.priceAtPurchase?.toFixed(2)}</p>
                </div>
                <span className="text-sm font-bold text-primary shrink-0">
                  ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          <h2 className="font-bold text-primary flex items-center gap-2"><CreditCard size={16} /> Payment Summary</h2>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-medium text-primary">₹{order.itemsPrice?.toFixed(2)}</span>
            </div>
            {order.coupon && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount ({order.coupon.code})</span>
                <span>-₹{order.coupon.discountAmount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={`font-bold ${order.shippingPrice === 0 ? "text-green-600" : "text-primary"}`}>
                {order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice?.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 text-base font-bold text-primary">
              <span>Total</span>
              <span>₹{order.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span>Payment Method</span>
              <span className="font-semibold text-primary">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          <h2 className="font-bold text-primary flex items-center gap-2"><MapPin size={16} /> Delivery Address</h2>
          <div className="text-sm text-gray-500 space-y-1">
            <p className="font-semibold text-primary">{order.shippingAddress?.fullName}</p>
            {order.shippingAddress?.address && <p>{order.shippingAddress?.address}</p>}
            <p>
              {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
              {order.shippingAddress?.postalCode}
            </p>
            <p>{order.shippingAddress?.country}</p>
            <p>{order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/account/orders" className="flex-1 text-center bg-primary text-white py-3 rounded-md font-bold hover:opacity-90 transition text-sm">
            View My Orders
          </Link>
          <Link to="/" className="flex-1 text-center border border-primary text-primary py-3 rounded-md font-bold hover:bg-primary/5 transition text-sm">
            Continue Shopping
          </Link>
        </div>

        {/* Request Cancellation Button */}
        {isCancellable(order) && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full py-3 border-2 border-dashed border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition text-sm flex items-center justify-center gap-2"
          >
            <X size={15} /> Request Cancellation
          </button>
        )}

        {/* Refund Info */}
        {order.paymentStatus === "refunded" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-emerald-700 font-bold text-sm">💸 Refund of ₹{order.totalPrice?.toFixed(2)} has been initiated to your original payment method.</p>
            <p className="text-emerald-600 text-xs mt-1">Typically appears within 5–10 business days.</p>
          </div>
        )}

      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <button onClick={() => setShowCancelModal(false)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600"><AlertTriangle size={22} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Cancel Order?</h3>
                <p className="text-xs text-gray-400">{order.orderNumber}</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
              <p className="text-sm text-amber-700 font-semibold">
                Your cancellation request will be sent to admin for review. If approved, a full refund of <span className="font-black">₹{order.totalPrice?.toFixed(2)}</span> will be initiated.
              </p>
              <p className="text-xs text-amber-500 mt-1">Admin will review your request within 24 hours.</p>
            </div>
            <div className="mb-5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                Reason for cancellation <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Let us know why you're cancelling..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-400 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 text-sm">Keep Order</button>
              <button
                onClick={handleCancelConfirm}
                disabled={cancelLoading}
                className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {cancelLoading ? <><RefreshCcw size={14} className="animate-spin"/> Sending...</> : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;