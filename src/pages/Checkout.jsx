import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, Search, Truck, Store } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import toast from "react-hot-toast";
import { getCart } from "../lib/cart";
import { createOrderAfterPayment, checkDelivery } from "../lib/order";
import { createPaymentIntentFromCart } from "../lib/payment";
import { Tag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProfile } from "../lib/profile";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const libraries = ["places"];

const DELIVERY_RANGE_MILES = 10;
const DELIVERY_RULES = {
  SP: { withinRange: 10, outsideRange: 10 },
  BB: { withinRange: 15, outsideRange: 50 },
};

const calcDeliveryFee = (shipping_category, distanceMiles) => {
  const rule = DELIVERY_RULES[shipping_category] ?? DELIVERY_RULES.SP;
  return distanceMiles <= DELIVERY_RANGE_MILES
    ? rule.withinRange
    : rule.outsideRange;
};

const calcCartDeliveryFee = (items, distanceMiles) => {
  if (!items || items.length === 0) return 0;
  if (distanceMiles === null || distanceMiles === undefined) return null;
  const categories = [
    ...new Set(items.map((i) => i.shipping_category ?? "SP")),
  ];
  return Math.max(
    ...categories.map((cat) => calcDeliveryFee(cat, distanceMiles)),
  );
};

const calcTotal = (items, distanceMiles = null, isPickup = false, discount = 0, isFreeShipping = false) => {
  let subtotalExclVat = 0;
  let totalVat = 0;
  items.forEach((item) => {
    const qty = item.quantity || 0;
    const exclVat = item.prices?.excludeVat;
    const inclVat = item.prices?.includeVat;
    const priceExcl = exclVat?.discount || exclVat?.base || 0;
    const priceIncl = inclVat?.discount || inclVat?.base || priceExcl;
    subtotalExclVat += priceExcl * qty;
    totalVat += (priceIncl - priceExcl) * qty;
  });
  const shipping = (isPickup || isFreeShipping)
    ? 0
    : (calcCartDeliveryFee(items, distanceMiles) ?? 0);
  const total = Math.max(subtotalExclVat + totalVat + shipping - discount, 0);
  return {
    subtotal: subtotalExclVat,
    vat: totalVat,
    shipping,
    discount,
    total,
  };
};

const CheckoutForm = ({
  items,
  distanceMiles,
  setDistanceMiles,
  onShippingMethodChange,
  onCouponApplied,
}) => {
  const navigate = useNavigate();
  const { updateCartCount } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("delivery");
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [coords, setCoords] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountAmount, isFreeShipping }
  const autocompleteRef = useRef(null);
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  const [defaultAddress, setDefaultAddress] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => {
        if (res.success) {
          const { name, email, phone, addresses } = res.data;
          const def =
            addresses?.find((a) => a.isDefault) || addresses?.[0] || null;
          setDefaultAddress(def);
          setForm((prev) => ({
            ...prev,
            email: email || "",
            fullName: name || "",
            phone: phone || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const isPickup = shippingMethod === "store_pickup";
  const { total } = calcTotal(items, distanceMiles, isPickup, appliedCoupon?.discountAmount ?? 0, appliedCoupon?.isFreeShipping ?? false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry) return;
    const components = place.address_components || [];
    const get = (type) => components.find((c) => c.types.includes(type))?.long_name || "";
    const address = `${get("street_number")} ${get("route")}`.trim() || place.formatted_address;
    const city = get("postal_town") || get("locality") || get("administrative_area_level_2");
    const postalCode = get("postal_code");
    setForm((prev) => ({ ...prev, address, city, postalCode }));
    setSearchInput(address);
    setCoords({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    setDeliveryStatus(null);
  };

  const handleVerifyDelivery = async () => {
    if (!searchInput.trim() || !coords) {
      toast.error(
        "Please search and select a valid address from the dropdown first.",
      );
      return;
    }
    setCheckingLocation(true);
    try {
      const res = await checkDelivery(coords.lat, coords.lng);
      setDeliveryStatus(res.data);
      setDistanceMiles(res.data?.distanceMiles ?? null);
      if (res.data?.available && defaultAddress && !form.address) {
        setForm((prev) => ({
          ...prev,
          address: defaultAddress.street || "",
          city: defaultAddress.city || "",
          postalCode: defaultAddress.zipCode || "",
          country: defaultAddress.country || "United Kingdom",
        }));
      }
    } catch {
      toast.error("Error verifying delivery coverage");
    } finally {
      setCheckingLocation(false);
    }
  };

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);
    setClientSecret(null);
    setPaymentIntentId(null);
    setDeliveryStatus(null);
    setDistanceMiles(null);
    onShippingMethodChange?.(method === "store_pickup");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setClientSecret(null);
    setPaymentIntentId(null);
    onCouponApplied?.(null);
  };

  // Build shippingAddress based on method
  const buildShippingAddress = () => {
    if (isPickup) {
      return {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address || "",
        city: form.city || "",
        postalCode: form.postalCode || "",
        country: form.country,
      };
    }
    return { ...form, ...coords };
  };

  const handleInitPayment = async () => {
    if (!isPickup && !deliveryStatus?.available) {
      toast.error("Verify delivery first");
      return;
    }
    try {
      setSubmitting(true);
      const shippingAddress = buildShippingAddress();
      const res = await createPaymentIntentFromCart(
        shippingAddress,
        shippingMethod,
        appliedCoupon?.code ?? null,
      );
      if (!res.success) throw new Error(res.message);
      setClientSecret(res.data.clientSecret);
      setPaymentIntentId(res.data.paymentIntentId);
      // Server se confirmed coupon data update karo
      if (res.data.coupon) {
        setAppliedCoupon(res.data.coupon);
        onCouponApplied?.(res.data.coupon);
      }
      toast.success("Payment initialized. Enter your card details.");
    } catch (err) {
      toast.error(err.message || "Failed to initialize payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !clientSecret || !paymentIntentId) return;
    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }
    console.log(
      "Submitting payment with clientSecret:",
      clientSecret,
      submitting,
      paymentIntentId,
    );
    try {
      setSubmitting(true);

      // Step 1: Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: form.fullName,
              email: form.email,
              phone: form.phone,
            },
          },
        },
      );

      if (error) throw new Error(error.message);
      if (paymentIntent.status !== "succeeded") {
        toast.error("Payment not completed");
        return;
      }

      // Step 2: Create order after payment succeeded
      const shippingAddress = buildShippingAddress();
      const orderRes = await createOrderAfterPayment({
        paymentIntentId: paymentIntent.id,
        shippingAddress,
        shippingMethod,
      });

      if (!orderRes.success) throw new Error(orderRes.message);

      updateCartCount(0);
      toast.success("Order placed successfully!");
      navigate(`/orders/${orderRes.data.orderId}?success=true`);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const canPlaceOrder = !!clientSecret && !!paymentIntentId;

  return (
    <form onSubmit={handleSubmit} className="flex-1 space-y-6 w-full">
      {/* SECTION 1: CONTACT */}

      <button
        className="px-8 py-1.5 bg-primary text-white rounded-md"
        onClick={() => window.history.back()}
      >
        Back
      </button>
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
            1
          </span>
          Contact Information
        </h3>
        <input
          name="email"
          type="email"
          placeholder="Email address *"
          required
          value={form.email}
          readOnly
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </section>

      {/* SECTION 2: SHIPPING METHOD */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
            2
          </span>
          Shipping Method
        </h3>
        <div className="grid grid-cols-2 border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => handleShippingMethodChange("delivery")}
            className={`py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${shippingMethod === "delivery" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
          >
            <Truck size={16} /> Home Delivery
          </button>
          <button
            type="button"
            onClick={() => handleShippingMethodChange("store_pickup")}
            className={`py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${shippingMethod === "store_pickup" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
          >
            <Store size={16} /> Store Pickup
          </button>
        </div>

        {isPickup && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 font-medium animate-in fade-in slide-in-from-top-1">
            <p className="font-bold mb-1">📍 Store Address</p>
            <p>
              You can pick up your order directly from our store. Payment is
              required online to confirm your order.
            </p>
          </div>
        )}

        {/* Delivery address section */}
        {!isPickup && (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4 shadow-sm">
              <div className="relative">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  Search Your Address
                </label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                  <Autocomplete
                    onLoad={(ac) => (autocompleteRef.current = ac)}
                    onPlaceChanged={onPlaceChanged}
                    options={{ componentRestrictions: { country: ["in", "gb"] } }}
                  >
                    <input
                      type="text"
                      placeholder="Enter first line of the address"
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        if (!e.target.value) { setCoords(null); setDeliveryStatus(null); }
                      }}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </Autocomplete>
                </div>
              </div>
              <button
                type="button"
                onClick={handleVerifyDelivery}
                disabled={checkingLocation || !searchInput.trim()}
                className={`w-full py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${!searchInput.trim() || checkingLocation ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"}`}
              >
                {checkingLocation ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Truck size={18} />
                )}
                {checkingLocation
                  ? "Checking Coverage..."
                  : "Verify Delivery Coverage"}
              </button>
              {deliveryStatus && (
                <div
                  className={`flex items-center gap-3 text-sm font-semibold rounded-lg px-4 py-3 border animate-in fade-in slide-in-from-top-1 ${deliveryStatus.available ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
                >
                  {deliveryStatus.available ? (
                    <CheckCircle size={18} className="shrink-0" />
                  ) : (
                    <Truck size={18} className="shrink-0" />
                  )}
                  <span>{deliveryStatus.message}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="fullName"
                placeholder="Full name *"
                required
                value={form.fullName}
                onChange={handleChange}
                readOnly
                className="border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                name="phone"
                placeholder="Phone number *"
                required
                value={form.phone}
                readOnly
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <input
              name="address"
              placeholder="Flat/House number and street *"
              required
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="city"
                placeholder="City *"
                required
                value={form.city}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                name="postalCode"
                placeholder="Pincode *"
                required
                value={form.postalCode}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        {/* Store pickup — name, phone + optional address */}
        {isPickup && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="fullName"
                placeholder="Full name *"
                required
                value={form.fullName}
                readOnly
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                name="phone"
                placeholder="Phone number *"
                required
                value={form.phone}
                readOnly
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <p className="text-xs text-gray-400 font-medium">Optional: add your address for receipt reference</p>
            <input
              name="address"
              placeholder="Address (optional)"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="city"
                placeholder="City (optional)"
                value={form.city}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                name="postalCode"
                placeholder="Pincode (optional)"
                value={form.postalCode}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: COUPON */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
          Coupon Code
        </h3>
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
              <Tag size={16} />
              <span>{appliedCoupon.code}</span>
              {appliedCoupon.isFreeShipping
                ? <span className="text-xs font-bold bg-green-100 px-2 py-0.5 rounded-full">Free Shipping</span>
                : <span className="text-xs font-bold bg-green-100 px-2 py-0.5 rounded-full">-₹{appliedCoupon.discountAmount?.toFixed(2)}</span>
              }
            </div>
            <button type="button" onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              className="flex-1 border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={async () => {
                if (!couponInput.trim()) return;
                try {
                  const { api } = await import("../lib/api.js");
                  const res = await api.post("/coupons/validate", { code: couponInput.trim() });
                  if (res.data.success) {
                    const c = res.data.data;
                    setAppliedCoupon({ code: c.code, discountAmount: c.discountAmount, isFreeShipping: c.isFreeShipping });
                    onCouponApplied?.({ code: c.code, discountAmount: c.discountAmount, isFreeShipping: c.isFreeShipping });
                    toast.success("Coupon applied!");
                  }
                } catch (err) {
                  toast.error(err.response?.data?.message || "Invalid coupon");
                }
              }}
              className="px-5 py-3 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all"
            >
              Apply
            </button>
          </div>
        )}
      </section>

      {/* SECTION 4: PAYMENT */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
            4
          </span>
          Payment
        </h3>
        <div className="border border-gray-300 rounded-xl p-4 bg-white space-y-4">
          {!clientSecret ? (
            <button
              type="button"
              onClick={handleInitPayment}
              disabled={submitting || (!isPickup && !deliveryStatus?.available)}
              className="w-full bg-black text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Initialize Payment"
              )}
            </button>
          ) : (
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1a1a1a",
                    "::placeholder": { color: "#aab7c4" },
                  },
                },
              }}
            />
          )}
        </div>
      </section>

      <button
        type="submit"
        disabled={submitting || !canPlaceOrder}
        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:bg-gray-400 transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base"
      >
        {submitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          `Place My Order • ₹${total.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

const OrderSummary = ({ items, distanceMiles, isPickup, appliedCoupon }) => {
  const discount = appliedCoupon?.discountAmount ?? 0;
  const isFreeShipping = appliedCoupon?.isFreeShipping ?? false;
  const { subtotal, vat, shipping, total } = calcTotal(
    items,
    distanceMiles,
    isPickup,
    discount,
    isFreeShipping,
  );
  const { isVatInc } = useCart();
  return (
    <div className="w-full lg:w-[380px] shrink-0 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit lg:sticky lg:top-8 lg:mt-0 mt-8">
      <h3 className="text-lg font-bold text-primary mb-6 border-b pb-4">
        Items in Cart
      </h3>
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar py-3">
        {items.map((item) => {
          const activePrices = isVatInc ? item.prices?.includeVat : item.prices?.excludeVat;
          const price = activePrices?.discount || activePrices?.base ||
            item.prices?.includeVat?.discount || item.prices?.includeVat?.base ||
            item.prices?.excludeVat?.discount || item.prices?.excludeVat?.base || 0;
          return (
            <div key={item._id} className="flex gap-4 items-center">
              <div className="relative shrink-0 border border-gray-100 rounded-lg p-1">
                <img
                  src={item.image}
                  className="w-12 h-12 object-contain"
                  alt={item.name}
                />
                <span className="absolute -top-2 -right-2 bg-primary text-white w-5 h-5 flex items-center justify-center text-[10px] rounded-full font-bold shadow-md">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.name}
                </p>
                {item.variantLabel && (
                  <p className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mt-0.5">{item.variantLabel}</p>
                )}
                <p className="text-xs text-gray-400">
                  ₹{price.toFixed(2)} each
                </p>
              </div>
              <span className="text-sm font-bold text-primary">
                ₹{(price * item.quantity).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal (Net)</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {/* <div className="flex justify-between text-sm text-gray-500">
          <span>Total VAT</span>
          <span>₹{vat.toFixed(2)}</span>
        </div> */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span
            className={
              isPickup || shipping === 0
                ? "text-green-600 font-bold"
                : "text-gray-800"
            }
          >
            {isPickup
              ? "FREE (Store Pickup)"
              : isFreeShipping
                ? "FREE (Coupon)"
                : distanceMiles === null
                  ? "Calculated after address"
                  : shipping === 0
                    ? "FREE"
                    : `₹${shipping.toFixed(2)}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-semibold">
            <span>Coupon Discount ({appliedCoupon?.code})</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-4 mt-2 flex justify-between items-center border-t-2 border-primary/10">
          <span className="text-lg font-black text-primary">Grand Total</span>
          <span className="text-xl font-black text-primary">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distanceMiles, setDistanceMiles] = useState(null);
  const [isPickup, setIsPickup] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    getCart()
      .then((res) => setItems(res.cart?.items || []))
      .catch(() => toast.error("Failed to load cart items"))
      .finally(() => setLoading(false));
  }, []);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_API_KEY, libraries });

  if (loading || !isLoaded)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-500 font-medium">Preparing your checkout...</p>
      </div>
    );

  return (
    <div className="bg-gray-50/50 min-h-screen lg:py-8 py-5">
      <div className="custom-container">
        <div className="flex flex-col lg:flex-row lg:gap-x-10 items-start">
          <Elements stripe={stripePromise}>
            <CheckoutForm
              items={items}
              distanceMiles={distanceMiles}
              setDistanceMiles={setDistanceMiles}
              onShippingMethodChange={setIsPickup}
              onCouponApplied={setAppliedCoupon}
            />
          </Elements>
          <OrderSummary
            items={items}
            distanceMiles={distanceMiles}
            isPickup={isPickup}
            appliedCoupon={appliedCoupon}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
