import React, { useState, useEffect } from "react";
import {
  Home, Package, Truck, CheckCircle2, Clock, MapPin, Search,
  Calendar, ChevronRight, Store, QrCode, ExternalLink, Hash,
  AlertCircle, User, RefreshCcw,
} from "lucide-react";
import { RiArrowDropRightLine } from "react-icons/ri";
import { Link, useSearchParams } from "react-router-dom"; // Hook imported for URL Query Detection
import { api } from "../lib/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  pending:           "Order Placed",
  confirmed:         "Order Confirmed",
  processing:        "Processing",
  shipped:           "Shipped",
  out_for_delivery:  "Out For Delivery",
  delivered:         "Delivered",
  ready_for_pickup:  "Ready For Pickup",
  picked_up:         "Picked Up",
  cancelled:         "Cancelled",
};

const STEP_ICONS = {
  pending:           Package,
  confirmed:         CheckCircle2,
  processing:        RefreshCcw,
  shipped:           Truck,
  out_for_delivery:  Truck,
  delivered:         CheckCircle2,
  ready_for_pickup:  Store,
  picked_up:         CheckCircle2,
};

// Helper function to format timestamp beautifully with Date & Time
const formatTimelineDateTime = (isoString) => {
  if (!isoString) return { date: "", time: "" };
  const dateObj = new Date(isoString);
  
  const date = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
};

// ─── Component ────────────────────────────────────────────────────────────────

const OrderTracking = () => {
  const [searchParams] = useSearchParams(); // Query Param Listener initialized
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail]             = useState("");
  const [isGuest, setIsGuest]         = useState(true);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [trackData, setTrackData]     = useState(null);

  // ─── CORE CALLABLE TRACKING HANDLER ───
  const executeTracking = async (targetOrder, targetEmail, useGuestMode) => {
    if (!targetOrder.trim()) return;
    setError(""); 
    setTrackData(null); 
    setLoading(true);

    try {
      let res;
      if (useGuestMode) {
        if (!targetEmail.trim()) { 
          setError("Email is required for guest tracking."); 
          setLoading(false); 
          return; 
        }
        res = await api.post("/orders/track-guest", { 
          orderNumber: targetOrder.trim(), 
          email: targetEmail.trim() 
        });
      } else {
        res = await api.get(`/orders/track/${targetOrder.trim()}`);
      }

      if (res.data?.success) {
        setTrackData(res.data.data);
      } else {
        setError("Order not found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Order not found. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  // ─── MANUAL ACTION TRIGGER ───
  const handleTrack = (e) => {
    e.preventDefault();
    executeTracking(orderNumber, email, isGuest);
  };

  // ─── AUTOMATIC QUERY PARAM DETECTION EFFECT ───
  useEffect(() => {
    const orderQuery = searchParams.get("order");
    const emailQuery = searchParams.get("email"); // Optional fallback structural mapping

    if (orderQuery) {
      setOrderNumber(orderQuery);
      if (emailQuery) {
        setEmail(emailQuery);
        setIsGuest(true);
        executeTracking(orderQuery, emailQuery, true);
      } else {
        setIsGuest(false);
        executeTracking(orderQuery, "", false);
      }
    }
  }, [searchParams]);

  const isPickup     = trackData?.shippingMethod === "store_pickup";
  const isCancelled  = trackData?.currentStatus === "cancelled";
  const td           = trackData?.trackingDetails;
  const pd           = trackData?.pickupDetails;

  return (
    <div className="min-h-screen bg-white font-main pb-12 ">
      {/* Breadcrumb */}
      {/* <div className="pt-3 sm:px-0 px-4">
        <div className="max-w-[1350px] rounded-lg mx-auto bg-white border-b border-[#ECECEC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 py-4 overflow-x-auto whitespace-nowrap">
            <Home size={16} className="text-primary flex-shrink-0" />
            <Link to="/" className="hover:text-primary text-primary font-medium">Home</Link>
            <RiArrowDropRightLine size={20} className="flex-shrink-0" />
            <span className="font-medium text-primary">Track Your Order</span>
          </div>
        </div>
      </div> */}

      <div className="custom-container pt-6 ">
        {/* ─── Search Box ─── */}
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-10 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 -mr-10 -mt-10 hidden md:block"><Truck size={200} /></div>
          <div className="max-w-2xl relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">Track your order</h2>
            <p className="text-gray-500 mb-5 font-medium text-sm sm:text-base">Enter your Order ID to get real-time status of your package.</p>

            {/* Toggle: registered vs guest */}
            <div className="flex flex-wrap gap-2 mb-5">
              {/* <button type="button" onClick={() => { setIsGuest(false); setError(""); setTrackData(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isGuest ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                My Account Order
              </button> */}
              {/* <button type="button" onClick={() => { setIsGuest(true); setError(""); setTrackData(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${isGuest ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                <User size={14}/>  Order
              </button> */}
            </div>

            <form onSubmit={handleTrack} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input type="text" placeholder="e.g. ORD-2606001" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-100 focus:border-secondary outline-none transition-all font-bold text-primary text-base" />
                </div>
                <button type="submit" disabled={loading}
                  className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap">
                  {loading ? <><RefreshCcw size={18} className="animate-spin"/> Tracking...</> : <>Track Now <ChevronRight size={18}/></>}
                </button>
              </div>
              {isGuest && (
                <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-lg border-2 border-gray-100 focus:border-secondary outline-none transition-all font-medium text-primary text-base animate-in fade-in duration-300" />
              )}
            </form>

            {error && (
              <div className="mt-4 flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-rose-600 text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
                <AlertCircle size={18} className="flex-shrink-0" /> {error}
              </div>
            )}
          </div>
        </div>

        {/* ─── Tracking Result ─── */}
        {trackData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Order Meta Banner */}
            <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${isPickup ? "bg-purple-100 text-purple-700" : "bg-primary/10 text-primary"}`}>
                  {isPickup ? <Store size={24}/> : <Truck size={24}/>}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order Number</p>
                  <h3 className="text-xl sm:text-2xl font-black text-primary">{trackData.orderNumber}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">Placed on {new Date(trackData.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide border ${isCancelled ? "bg-rose-50 text-rose-700 border-rose-200" : isPickup ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-primary/10 text-primary border-primary/20"}`}>
                  {trackData.statusLabel}
                </span>
                {td?.estimatedDeliveryDate && !isCancelled && !isPickup && (
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-700 bg-secondary/50 px-4 py-2 rounded-xl border border-secondary">
                    <Calendar size={14}/> Est. {new Date(td.estimatedDeliveryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </div>
                )}
              </div>
            </div>

            {/* ─── Timeline ─── */}
            <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-6 overflow-hidden">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">
                {isPickup ? "Pickup Progress" : "Delivery Progress"}
              </h4>

              {isCancelled ? (
                <div className="flex items-center gap-3 bg-rose-50 rounded-2xl p-5 border border-rose-100 text-rose-600 font-semibold">
                  <AlertCircle size={22} className="flex-shrink-0"/> This order has been cancelled.
                </div>
              ) : (
                <>
                  {/* Desktop horizontal stepper (Large Screens Only) */}
                  <div className="hidden lg:block relative pt-4 pb-8">
                    <div className="absolute top-9 left-0 w-full h-1 bg-gray-100 rounded-full">
                      <div className="h-full bg-primary transition-all duration-700 rounded-full"
                        style={{ width: `${trackData.timeline ? ((trackData.timeline.filter(s => s.completed).length - 1) / Math.max(trackData.timeline.length - 1, 1)) * 100 : 0}%` }} />
                    </div>
                    
                    <div className="relative flex justify-between items-start">
                      {trackData.timeline?.map((step, i) => {
                        const Icon = STEP_ICONS[step.status] || Clock;
                        const { date, time } = formatTimelineDateTime(step.timestamp);
                        return (
                          <div key={i} className="flex flex-col items-center gap-2 z-10 relative flex-1 px-2">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center border-4 shadow-sm transition-all duration-500 ${step.completed ? "bg-primary border-white text-white" : "bg-white border-gray-100 text-gray-300"} ${step.active ? "ring-8 ring-primary/10 scale-110" : ""}`}>
                              {step.completed ? <Icon size={18} strokeWidth={2.5}/> : <Clock size={16}/>}
                            </div>
                            
                            <p className={`text-xs font-black text-center mt-1 max-w-[120px] leading-tight ${step.completed ? "text-primary" : "text-gray-400"}`}>
                              {step.label}
                            </p>
                            
                            {step.timestamp && (
                              <div className="text-center mt-0.5 space-y-0.5 bg-gray-50/50 rounded-lg p-1.5 border border-gray-100/60 min-w-[90px]">
                                <p className="text-[11px] font-extrabold text-slate-700 whitespace-nowrap">{date}</p>
                                <p className="text-[10px] font-bold text-gray-400 whitespace-nowrap uppercase">{time}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile & Tablet vertical stepper (Medium, Small & Extra Small Screens) */}
                  <div className="lg:hidden relative border-l-2 border-gray-100 ml-4 pl-6 space-y-8 py-2">
                    {trackData.timeline?.map((step, i) => {
                      const Icon = STEP_ICONS[step.status] || Clock;
                      const { date, time } = formatTimelineDateTime(step.timestamp);
                      return (
                        <div key={i} className="relative flex items-start gap-4">
                          {/* Circle dot placed accurately on left border link */}
                          <div className={`absolute -left-[35px] top-0 w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all shadow-sm ${step.completed ? "bg-primary border-primary text-white" : "bg-white border-gray-200 text-gray-300"} ${step.active ? "ring-4 ring-primary/10 scale-105" : ""}`}>
                            {step.completed ? <Icon size={16} strokeWidth={2.5}/> : <Clock size={14}/>}
                          </div>

                          <div className="flex-1 pt-1 bg-gray-50/40 p-3 rounded-xl border border-gray-100/50">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm sm:text-base font-black ${step.completed ? "text-primary" : "text-gray-400"}`}>
                                {step.label}
                              </p>
                              {step.active && (
                                <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                  Current
                                </span>
                              )}
                            </div>
                            
                            {step.timestamp && (
                              <div className="mt-1.5 flex items-center gap-3 text-slate-600">
                                <span className="text-xs sm:text-sm font-extrabold bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-sm">
                                  {date}
                                </span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                  {time}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: courier / pickup info */}
              <div className="lg:col-span-2 space-y-5">
                {/* Delivery: courier card */}
                {!isPickup && td && (td.trackingNumber || td.courierName) && (
                  <div className="bg-[#253D4E] text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                    <Truck size={80} className="absolute -right-4 -bottom-4 text-white/10 pointer-events-none" />
                    <h3 className="text-secondary font-extrabold text-xs uppercase tracking-widest mb-4">Shipping Partner</h3>
                    {td.courierName && <p className="text-xl font-bold mb-1">{td.courierName}</p>}
                    {td.trackingNumber && (
                      <div className="flex items-center gap-2 text-white/70 text-sm mb-5">
                        <Hash size={13}/> Tracking ID: <span className="font-mono font-bold text-white">{td.trackingNumber}</span>
                      </div>
                    )}
                    {td.trackingUrl && (
                      <a href={td.trackingUrl} target="_blank" rel="noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-lg text-sm hover:bg-secondary transition-colors shadow-md">
                        <ExternalLink size={15}/> Track on Courier Site
                      </a>
                    )}
                  </div>
                )}

                {/* Pickup: pickup code card */}
                {isPickup && pd?.pickupCode && (
                  <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-6 border border-fuchsia-100">
                    <div className="flex items-center gap-2 mb-4">
                      <QrCode size={20} className="text-fuchsia-600" />
                      <h3 className="font-bold text-fuchsia-800 text-xs sm:text-sm uppercase tracking-wider">Your Pickup Code</h3>
                    </div>
                    <div className="bg-fuchsia-50 rounded-2xl p-6 text-center border border-fuchsia-100">
                      <p className="text-3xl sm:text-4xl font-black tracking-[0.25em] sm:tracking-[0.3em] text-fuchsia-800 break-all pl-[0.3em]">{pd.pickupCode}</p>
                      <p className="text-xs text-fuchsia-500 font-semibold mt-2">Show this code at the store counter</p>
                    </div>
                    {pd.pickedUpAt && (
                      <div className="mt-4 text-sm text-teal-700 bg-teal-50 rounded-xl px-4 py-3 font-semibold flex items-center gap-2 flex-wrap">
                        <CheckCircle2 size={16} className="flex-shrink-0"/> Picked up on {new Date(pd.pickedUpAt).toLocaleString()}
                        {pd.pickedUpBy && ` by ${pd.pickedUpBy}`}
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery dates */}
                {!isPickup && td && (td.deliveredAt || td.estimatedDeliveryDate) && (
                  <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-5 flex flex-col sm:flex-row gap-4">
                    {td.estimatedDeliveryDate && !td.deliveredAt && (
                      <div className="flex-1 bg-secondary/50 rounded-xl p-4 text-center border border-secondary">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Estimated Delivery</p>
                        <p className="text-base sm:text-lg font-black text-primary">{new Date(td.estimatedDeliveryDate).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" })}</p>
                      </div>
                    )}
                    {td.deliveredAt && (
                      <div className="flex-1 bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Delivered On</p>
                        <p className="text-base sm:text-lg font-black text-emerald-800">{new Date(td.deliveredAt).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" })}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: delivery address / pickup notice */}
              <div className="space-y-5">
                {!isPickup && trackData.deliveryAddress && (
                  <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden">
                    <div className="bg-primary/5 px-6 py-4 flex items-center gap-2">
                      <MapPin size={18} className="text-primary" />
                      <h3 className="font-bold text-primary text-xs uppercase tracking-widest">Delivery Address</h3>
                    </div>
                    <div className="p-6">
                      <p className="font-black text-primary text-lg mb-1">{trackData.deliveryAddress.fullName}</p>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {trackData.deliveryAddress.city}, {trackData.deliveryAddress.postalCode}<br/>
                        {trackData.deliveryAddress.country}
                      </p>
                    </div>
                  </div>
                )}

                {isPickup && (
                  <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden">
                    <div className="bg-purple-50 px-6 py-4 flex items-center gap-2">
                      <Store size={18} className="text-purple-700" />
                      <h3 className="font-bold text-purple-700 text-xs uppercase tracking-widest">Store Pickup</h3>
                    </div>
                    <div className="p-6 text-sm text-gray-600 font-medium space-y-1">
                      <p>Visit us during store hours once your order is marked <span className="font-black text-fuchsia-700">Ready For Pickup</span>.</p>
                      <p className="text-xs text-gray-400 mt-2">Bring your pickup code and a valid ID.</p>
                    </div>
                  </div>
                )}

                {/* Help block */}
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-5 text-center">
                  <p className="text-xs text-gray-400 font-medium">Need help with your order?</p>
                  <Link to="/contact" className="text-primary font-bold text-sm hover:underline mt-1 block">Contact Support →</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state help text */}
        {!trackData && !loading && !error && (
          <div className="mt-12 text-center">
            <p className="text-gray-400 font-medium text-sm sm:text-base">
              Can't find your Order ID? Check your email or{" "}
              <Link to="/account/orders" className="text-primary font-bold underline">My Orders</Link> section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;