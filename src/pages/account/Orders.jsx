import React, { useState, useEffect } from "react";
import {
  Search, ChevronRight, Star, Package, ShoppingBag,
  Loader2, X, AlertTriangle, RefreshCcw, Truck, Store, ExternalLink,
} from "lucide-react";
import { getMyOrders, requestCancellation } from "../../lib/order";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// Statuses customer can cancel
const CANCELLABLE_DELIVERY = new Set(["pending", "confirmed", "processing"]);
const CANCELLABLE_PICKUP   = new Set(["pending", "confirmed", "processing", "ready_for_pickup"]);

const isCancellable = (order) => {
  if (["cancelled", "delivered", "picked_up"].includes(order.orderStatus)) return false;
  const set = order.shippingMethod === "store_pickup" ? CANCELLABLE_PICKUP : CANCELLABLE_DELIVERY;
  return set.has(order.orderStatus);
};

const STATUS_LABELS = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing",
  shipped: "Shipped", out_for_delivery: "Out For Delivery", delivered: "Delivered",
  ready_for_pickup: "Ready For Pickup", picked_up: "Picked Up", cancelled: "Cancelled",
};

const STATUS_STYLES = {
  pending:          "bg-amber-50 text-amber-700 border-amber-200",
  confirmed:        "bg-blue-50 text-blue-700 border-blue-200",
  processing:       "bg-sky-50 text-sky-700 border-sky-200",
  shipped:          "bg-indigo-50 text-indigo-700 border-indigo-200",
  out_for_delivery: "bg-purple-50 text-purple-700 border-purple-200",
  delivered:        "bg-emerald-50 text-emerald-700 border-emerald-200",
  ready_for_pickup: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  picked_up:        "bg-teal-50 text-teal-700 border-teal-200",
  cancelled:        "bg-rose-50 text-rose-700 border-rose-200",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const OrderSkeleton = () => (
  <div className="flex flex-col md:flex-row items-center gap-6 p-5 border border-gray-100 rounded-xl bg-white animate-pulse">
    <div className="w-28 h-28 bg-slate-100 rounded-lg" />
    <div className="flex-1 space-y-3 w-full">
      <div className="h-4 bg-slate-100 rounded w-1/4" />
      <div className="h-6 bg-slate-100 rounded w-1/2" />
      <div className="h-4 bg-slate-100 rounded w-1/3" />
    </div>
    <div className="md:w-56 w-full space-y-2">
      <div className="h-4 bg-slate-100 rounded w-full" />
      <div className="h-10 bg-slate-100 rounded w-full" />
    </div>
  </div>
);

// ─── Cancel Confirmation Modal ─────────────────────────────────────────────────
const CancelModal = ({ order, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Cancel Order?</h3>
            <p className="text-xs text-gray-400">{order.orderNumber}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
          <p className="text-sm text-amber-700 font-semibold">
            Your cancellation request will be sent to admin for review. If approved, a full refund of <span className="font-black">Rs. {order.totalPrice?.toFixed(2)}</span> will be initiated.
          </p>
          <p className="text-xs text-amber-500 mt-1">Admin will review your request within 24 hours.</p>
        </div>

        <div className="mb-5">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
            Reason for cancellation <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Let us know why you're cancelling..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm">
            Keep Order
          </button>
          <button
            onClick={() => onConfirm(order._id, reason)}
            disabled={loading || !reason.trim()}
            className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
          >
            {loading ? <><RefreshCcw size={15} className="animate-spin" /> Sending...</> : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Orders = () => {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // Cancel request modal state
  const [cancelTarget, setCancelTarget]   = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getMyOrders(page, 10);
      if (data.success) {
        setOrders(data.orders);
        setPagination({ currentPage: data.currentPage, totalPages: data.totalPages });
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancelConfirm = async (orderId, reason) => {
    setCancelLoading(true);
    try {
      const res = await requestCancellation(orderId, reason);
      if (res.success) {
        toast.success("Cancellation request sent to admin.");
        setCancelTarget(null);
        fetchOrders(pagination.currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send cancellation request");
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderItems[0]?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          order={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelConfirm}
          loading={cancelLoading}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Orders</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Track, manage and review your purchases.</p>
        </div>
        <div className="relative flex-1 md:max-w-md group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order # or Product name..."
            className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none text-sm font-semibold transition-all shadow-sm bg-white"
          />
          <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-5">
        {loading ? (
          [...Array(3)].map((_, i) => <OrderSkeleton key={i} />)
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusStyle = STATUS_STYLES[order.orderStatus] || "bg-slate-50 text-slate-600 border-slate-200";
            const statusLabel = STATUS_LABELS[order.orderStatus] || order.orderStatus;
            const firstItem   = order.orderItems[0];
            const canCancel   = isCancellable(order);
            const isPickup    = order.shippingMethod === "store_pickup";
            const tracking    = order.trackingDetails;

            return (
              <div
                key={order._id}
                className="group border border-slate-200/60 rounded-2xl p-5 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-l-4 hover:border-l-blue-600 flex flex-col md:flex-row items-center gap-6"
              >
                {/* Product Image */}
                <Link to={`/orders/${order._id}`} className="flex-shrink-0">
                  <div className="w-28 h-28 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-2 flex items-center justify-center shrink-0">
                    <img
                      src={firstItem?.image || order.thumbnail}
                      alt={firstItem?.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </Link>

                {/* Info */}
                <Link to={`/orders/${order._id}`} className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${isPickup ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                      {isPickup ? <><Store size={9}/> Pickup</> : <><Truck size={9}/> Delivery</>}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {firstItem?.name}
                    {order.itemCount > 1 && <span className="text-slate-400 font-medium ml-2">(+{order.itemCount - 1} more)</span>}
                  </h3>

                  <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                    <span className="text-xl font-extrabold text-slate-900">Rs. {order.totalPrice.toFixed(2)}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded-lg">
                      {order.paymentMethod}
                    </span>
                  </div>

                  {/* 🚚 DELHIVERY TRACKING INFO BADGE */}
                  {tracking?.trackingNumber && (
                    <div className="mt-3 p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl inline-flex items-center gap-3 text-left">
                      <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                        <Truck size={14} />
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wide">
                          {tracking.courierName || "Delhivery"} AWB: <span className="font-mono text-blue-600">{tracking.trackingNumber}</span>
                        </p>
                        <p className="text-[10px] font-semibold text-slate-500">
                          Shipped on {new Date(tracking.shippedAt || order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </Link>

                {/* Status & Actions */}
                <div className="md:w-64 text-center md:text-left border-t md:border-t-0 pt-5 md:pt-0 w-full flex flex-col items-center md:items-start gap-3">
                  {/* Status badge */}
                  <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border ${statusStyle}`}>
                    {statusLabel}
                  </span>

                  {/* Payment status */}
                  <p className="text-xs font-semibold text-slate-400">
                    {order.paymentStatus === "refunded"
                      ? "💸 Refunded"
                      : order.paymentStatus === "paid"
                        ? "✅ Payment Verified"
                        : "⏳ Payment Pending"}
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 w-full">
                    
                    {/* Live Direct Delhivery Track Button */}
                    {tracking?.trackingUrl ? (
                      <a
                        href={tracking.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100"
                      >
                        <Truck size={13} /> Live Track Delhivery <ExternalLink size={12} />
                      </a>
                    ) : (
                      order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && order.orderStatus !== "picked_up" && (
                        <Link to={`/order-tracking?order=${order.orderNumber}`} className="w-full">
                          <button className="w-full flex items-center justify-center gap-2 text-blue-600 text-xs font-bold hover:bg-blue-50 px-3 py-2 rounded-xl transition-all border border-blue-100">
                            <Truck size={13} /> Track Order
                          </button>
                        </Link>
                      )
                    )}

                    {(order.orderStatus === "delivered" || order.orderStatus === "picked_up") && (
                      <Link to={`/account/add-review/${order?.orderItems?.[0]?.productId}`} className="w-full">
                        <button className="w-full flex items-center justify-center gap-2 text-blue-600 text-xs font-bold hover:bg-blue-50 px-3 py-2 rounded-xl transition-all border border-blue-100">
                          <Star size={13} className="fill-blue-600" /> Rate Product
                        </button>
                      </Link>
                    )}

                    {/* Cancellation request status badges */}
                    {order.cancellationStatus === "pending" && (
                      <span className="w-full flex items-center justify-center gap-1.5 text-amber-700 text-xs font-bold bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                        ⏳ Cancellation Requested
                      </span>
                    )}
                    {order.cancellationStatus === "rejected" && (
                      <div className="w-full bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                        <p className="text-xs font-bold text-rose-700">❌ Cancellation Rejected</p>
                        {order.cancellationRejectionReason && (
                          <p className="text-[10px] text-rose-500 mt-0.5">{order.cancellationRejectionReason}</p>
                        )}
                      </div>
                    )}

                    {/* Cancellation Button */}
                    {canCancel && order.cancellationStatus !== "pending" && order.cancellationStatus !== "rejected" && (
                      <button
                        onClick={() => setCancelTarget(order)}
                        className="w-full flex items-center justify-center gap-2 text-rose-600 text-xs font-bold hover:bg-rose-50 px-3 py-2 rounded-xl transition-all border border-rose-100"
                      >
                        <X size={13} /> Request Cancellation
                      </button>
                    )}
                  </div>
                </div>

                <div className="hidden md:block text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={24} strokeWidth={3} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h3>
            <p className="text-slate-500 max-w-xs mb-8 font-medium">It looks like you haven't placed any orders. Start shopping!</p>
            <button onClick={() => window.location.href = "/"} className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && orders.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => fetchOrders(i + 1)}
              className={`h-10 w-10 rounded-xl font-bold text-xs transition-all ${
                pagination.currentPage === i + 1
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;