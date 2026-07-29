import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, Search, Truck, AlertCircle, Tag, X } from "lucide-react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const API_URL = import.meta.env.VITE_API_BASE_URL;
const libraries = ["places"];

// ─── Calc Helpers ─────────────────────────────────────────────────────────────
const DELIVERY_RANGE_MILES = 16;

const DELIVERY_RULES = {
  SP: { withinRange: 100, outsideRange: 150 },
  BB: { withinRange: 100, outsideRange: 150 },
};

const calcDeliveryFee = (cat, miles) => {
  const rule = DELIVERY_RULES[cat] ?? DELIVERY_RULES.SP;
  return miles <= DELIVERY_RANGE_MILES ? rule.withinRange : rule.outsideRange;
};

const calcCartDeliveryFee = (items, miles) => {
  if (!items?.length) return 0;
  if (miles == null) return null;
  const cats = [...new Set(items.map((i) => i.shipping_category ?? "SP"))];
  return Math.max(...cats.map((c) => calcDeliveryFee(c, miles)));
};

const calcTotal = (items, miles = null, isPickup = false, discount = 0, isFreeShipping = false) => {
  let subtotal = 0;
  items.forEach((item) => {
    const qty = item.quantity || 0;
    // Always use includeVat price — matches backend priceAtPurchase (base + vat)
    const price = item.prices?.includeVat?.discount ?? item.prices?.includeVat?.base ?? item.prices?.excludeVat?.discount ?? item.prices?.excludeVat?.base ?? 0;
    subtotal += price * qty;
  });
  const computedShipping = calcCartDeliveryFee(items, miles);
  const shipping = (isPickup || isFreeShipping) ? 0 : (computedShipping ?? 0);
  const total = Math.max(subtotal + shipping - discount, 0);
  return { subtotal, shipping, discount, total };
};

// ─── Validators ────────────────────────────────────────────────────────────────
const validators = {
  email: (v) => {
    if (!v.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email address";
    const blocked = ["test.com", "example.com", "dummy.com", "fake.com", "abc.com", "temp.com"];
    const domain = v.split("@")[1]?.toLowerCase();
    if (blocked.includes(domain)) return "Please enter a real email address";
    return "";
  },
  fullName: (v) => {
    if (!v.trim()) return "Full name is required";
    if (v.trim().length < 4) return "Name must be at least 4 characters long";
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return "Name can only contain letters";
    if (!/\s/.test(v.trim())) return "Please enter your full name (first & last)";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Phone number is required";
    const digits = v.replace(/\D/g, "");
    if (digits.length !== 10) return "Phone number must be exactly 10 digits";
    const isRepeating = /^(\d)\1{9}$/.test(digits);
    const isSequential = "0123456789876543210".includes(digits);
    if (isRepeating) return "Invalid phone number (repeating digits)";
    if (isSequential) return "Invalid phone number (sequential digits)";
    return "";
  },
  address: (v) => {
    if (!v.trim()) return "Address is required";
    if (v.trim().length < 5) return "Enter a complete address";
    return "";
  },
  city: (v) => {
    if (!v.trim()) return "City is required";
    if (v.trim().length < 2) return "Enter a valid city name";
    return "";
  },
  postalCode: (v) => {
    if (!v.trim()) return "PIN code is required";
    if (!/^\d{6}$/.test(v.trim())) return "Enter a valid 6-digit PIN code";
    return "";
  },
};

const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1 font-medium">
      <AlertCircle size={12} /> {msg}
    </p>
  ) : null;

// ─── Main Form ────────────────────────────────────────────────────────────────
const GuestCheckoutForm = ({ 
  items, 
  distanceMiles, 
  setDistanceMiles, 
  onShippingMethodChange, 
  onCouponApplied, 
  appliedCoupon, 
  setAppliedCoupon 
}) => {
  const navigate = useNavigate();
  const { updateCartCount } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [shippingMethod] = useState("delivery");
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [coords, setCoords] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [touched, setTouched] = useState({});
  const [couponInput, setCouponInput] = useState("");
  const autocompleteRef = useRef(null);

  const [form, setForm] = useState({
    email: "", fullName: "", phone: "",
    address: "", city: "", postalCode: "", country: "India",
  });

  const isPickup = shippingMethod === "store_pickup";
  const { total } = calcTotal(
    items, 
    distanceMiles, 
    isPickup, 
    appliedCoupon?.discountAmount ?? 0, 
    appliedCoupon?.isFreeShipping ?? false
  );

  const errors = {
    email: validators.email(form.email),
    fullName: validators.fullName(form.fullName),
    phone: validators.phone(form.phone),
    address: validators.address(form.address),
    city: validators.city(form.city),
    postalCode: validators.postalCode(form.postalCode),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10) {
        setForm((prev) => ({ ...prev, [name]: onlyNums }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const inputClass = (field) =>
    `w-full border rounded-lg p-3.5 text-sm outline-none transition-all focus:ring-2 ${
      touched[field] && errors[field]
        ? "border-red-400 focus:ring-red-200 bg-red-50"
        : "border-gray-300 focus:ring-primary/20"
    }`;

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry) return;
    const components = place.address_components || [];
    const get = (type) => components.find((c) => c.types.includes(type))?.long_name || "";
    const newAddress = `${get("street_number")} ${get("route")}`.trim() || place.formatted_address;
    const newCity = get("postal_town") || get("locality") || get("administrative_area_level_2");
    const newPostcode = get("postal_code");
    setForm((prev) => ({ ...prev, address: newAddress, city: newCity, postalCode: newPostcode }));
    setTouched((prev) => ({ ...prev, address: true, city: true, postalCode: true }));
    setSearchInput(newAddress);
    setCoords({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    setDeliveryStatus(null);
    setDistanceMiles(null);
  };

  const handleVerifyDelivery = async () => {
    if (!searchInput.trim() || !coords) {
      toast.error("Please select a valid address from the dropdown first.");
      return;
    }
    setCheckingLocation(true);
    try {
      const res = await fetch(`${API_URL}/orders/check-delivery?lat=${coords.lat}&lng=${coords.lng}`);
      const data = await res.json();
      setDeliveryStatus(data.data);
      if (data.data?.available) {
        setDistanceMiles(data.data?.distanceKm ?? 0);
      } else {
        setDistanceMiles(null);
      }
    } catch {
      toast.error("Error verifying delivery coverage");
    } finally {
      setCheckingLocation(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    onCouponApplied?.(null);
  };

  const buildShippingAddress = () => {
    const fullPhone = `+91${form.phone}`;
    return { ...form, phone: fullPhone, ...coords };
  };

  const touchAll = () => {
    const fields = ["email", "fullName", "phone", "address", "city", "postalCode"];
    setTouched(fields.reduce((acc, f) => ({ ...acc, [f]: true }), {}));
  };

  const handleCheckoutAndPay = async (e) => {
    e.preventDefault();
    touchAll();

    if (Object.values(errors).some((err) => err !== "")) {
      toast.error("Please fix all errors before submitting.");
      return;
    }

    if (!deliveryStatus?.available) {
      toast.error("Please verify your delivery address coverage first.");
      return;
    }

    if (!window.Cashfree) {
      toast.error("Cashfree SDK failed to load. Please check your HTML setup.");
      return;
    }

    try {
      setSubmitting(true);
      const shippingAddress = buildShippingAddress();

      const response = await fetch(`${API_URL}/payments/create-intent-from-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress,
          shippingMethod,
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId || null, quantity: i.quantity })),
          couponCode: appliedCoupon?.code ?? null,
          customerDetails: {
            name: form.fullName,
            email: form.email,
            phone: `+91${form.phone}`,
          },
        }),
      });

      const resData = await response.json();
      if (!resData.success) throw new Error(resData.message || "Could not generate payment session.");

      const { paymentSessionId, orderId: cfOrderId } = resData.data;

      sessionStorage.setItem("pendingOrder", JSON.stringify({
        cfOrderId,
        shippingAddress,
        shippingMethod,
        isGuest: true,
        guestEmail: form.email,
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId || null, quantity: i.quantity, name: i.name })),
      }));

      const cashfree = window.Cashfree({
        mode: import.meta.env.PROD ? "production" : "sandbox",
      });

      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      }).then(async (result) => {
        if (result.error) {
          toast.error(result.error.message || "Payment cancelled or failed.");
          sessionStorage.removeItem("pendingOrder");
          setSubmitting(false);
          return;
        }

        if (result.paymentDetails) {
          await verifyAndCreateOrder(cfOrderId);
        }
      });
    } catch (err) {
      toast.error(err.message || "An error occurred launching checkout.");
      setSubmitting(false);
    }
  };

  const verifyAndCreateOrder = async (cfOrderId) => {
    try {
      const shippingAddress = buildShippingAddress();
      const res = await fetch(`${API_URL}/orders/create-after-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cfOrderId,
          shippingAddress,
          shippingMethod,
          guestEmail: form.email,
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId || null, quantity: i.quantity, name: i.name })),
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) throw new Error(orderData.message || "Order verification failed.");

      sessionStorage.removeItem("pendingOrder");
      localStorage.removeItem("guest_cart");
      updateCartCount(0);
      toast.success("Order placed successfully!");
      navigate(`/guest-order-success?orderNumber=${orderData.data.orderNumber}`);
    } catch (err) {
      toast.error(err.message || "Order verification failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCheckoutAndPay} className="flex-1 space-y-6 w-full">
      <button type="button" className="px-8 py-1.5 bg-primary text-white rounded-md text-sm font-bold" onClick={() => window.history.back()}>
        Back
      </button>

      {/* SECTION 1: CONTACT */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
          Contact Information
        </h3>
        <div>
          <input
            name="email" type="email" placeholder="Email address *"
            value={form.email} onChange={handleChange} onBlur={handleBlur}
            className={inputClass("email")}
          />
          <FieldError msg={touched.email && errors.email} />
        </div>
      </section>

      {/* SECTION 2: SHIPPING */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
          Shipping Method
        </h3>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4 shadow-sm">
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Search Your Address</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                <Autocomplete
                  onLoad={(ac) => (autocompleteRef.current = ac)}
                  onPlaceChanged={onPlaceChanged}
                  options={{ componentRestrictions: { country: ["in"] } }}
                >
                  <input
                    type="text"
                    placeholder="Enter street address or pincode"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      if (!e.target.value) { 
                        setCoords(null); 
                        setDeliveryStatus(null); 
                        setDistanceMiles(null);
                      }
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
              className={`w-full py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                !searchInput.trim() || checkingLocation ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {checkingLocation ? <Loader2 size={16} className="animate-spin" /> : <Truck size={18} />}
              {checkingLocation ? "Checking Coverage..." : "Verify Delivery Coverage"}
            </button>
            {deliveryStatus && (
              <div className={`flex items-center gap-3 text-sm font-semibold rounded-lg px-4 py-3 border ${
                deliveryStatus.available ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
              }`}>
                {deliveryStatus.available ? <CheckCircle size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                <span>{deliveryStatus.message}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input name="fullName" placeholder="Full name *" value={form.fullName} onChange={handleChange} onBlur={handleBlur} className={inputClass("fullName")} />
              <FieldError msg={touched.fullName && errors.fullName} />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-500 font-bold text-sm">+91</span>
              <input name="phone" type="tel" placeholder="Phone number *" value={form.phone} onChange={handleChange} onBlur={handleBlur} className={`${inputClass("phone")} pl-12`} />
              <FieldError msg={touched.phone && errors.phone} />
            </div>
          </div>
          <div>
            <input name="address" placeholder="Flat/House number and street *" value={form.address} onChange={handleChange} onBlur={handleBlur} className={inputClass("address")} />
            <FieldError msg={touched.address && errors.address} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input name="city" placeholder="City *" value={form.city} onChange={handleChange} onBlur={handleBlur} className={inputClass("city")} />
              <FieldError msg={touched.city && errors.city} />
            </div>
            <div>
              <input name="postalCode" placeholder="Pincode *" value={form.postalCode} onChange={handleChange} onBlur={handleBlur} className={inputClass("postalCode")} />
              <FieldError msg={touched.postalCode && errors.postalCode} />
            </div>
          </div>
        </div>
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
                  const res = await fetch(`${API_URL}/coupons/validate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      code: couponInput.trim(),
                      items: items.map((i) => ({ productId: i.productId, variantId: i.variantId || null, quantity: i.quantity })),
                    }),
                  });
                  const data = await res.json();
                  if (!data.success) throw new Error(data.message);
                  const c = data.data;
                  const newCoupon = { code: c.code, discountAmount: c.discountAmount, isFreeShipping: c.isFreeShipping };
                  setAppliedCoupon(newCoupon);
                  onCouponApplied?.(newCoupon);
                  toast.success("Coupon applied!");
                } catch (err) {
                  toast.error(err.message || "Invalid coupon");
                }
              }}
              className="px-5 py-3 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all"
            >
              Apply
            </button>
          </div>
        )}
      </section>

      {/* SINGLE SUBMIT AND PAY BUTTON */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:bg-gray-400 transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base"
      >
        {submitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          `Pay & Place Order • ₹${total.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

// ─── Order Summary ────────────────────────────────────────────────────────────
const OrderSummary = ({ items, distanceMiles, isPickup, appliedCoupon }) => {
  const discount = appliedCoupon?.discountAmount ?? 0;
  const isFreeShipping = appliedCoupon?.isFreeShipping ?? false;
  const { subtotal, shipping, total } = calcTotal(items, distanceMiles, isPickup, discount, isFreeShipping);
  
  return (
    <div className="w-full lg:w-[380px] shrink-0 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit lg:sticky lg:top-8 lg:mt-0 mt-8">
      <h3 className="text-lg font-bold text-primary mb-6 border-b pb-4">Order Summary</h3>
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar py-3">
        {items.map((item) => {
          const price = item.prices?.includeVat?.discount ?? item.prices?.includeVat?.base ?? 0;
          return (
            <div key={item.productId} className="flex gap-4 items-center">
              <div className="relative shrink-0 border border-gray-100 rounded-lg p-1">
                <img src={item.image} className="w-12 h-12 object-contain" alt={item.name} />
                <span className="absolute -top-2 -right-2 bg-primary text-white w-5 h-5 flex items-center justify-center text-[10px] rounded-full font-bold shadow-md">{item.quantity}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-400">₹{price.toFixed(2)} each</p>
              </div>
              <span className="text-sm font-bold text-primary">₹{(price * item.quantity).toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
        <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping Fee</span>
          <span className={isPickup || isFreeShipping || (shipping === 0 && distanceMiles !== null) ? "text-green-600 font-bold" : "text-gray-800"}>
            {isPickup 
              ? "FREE (Store Pickup)" 
              : isFreeShipping 
              ? "FREE (Coupon)" 
              : distanceMiles === null 
              ? <span className="text-orange-500 font-semibold">Calculated after address</span> 
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
          <span className="text-xl font-black text-primary">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Guest Page Component ────────────────────────────────────────────────
const GuestCheckoutPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distanceMiles, setDistanceMiles] = useState(null);
  const [isPickup, setIsPickup] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    setItems(cart);
    setLoading(false);
  }, []);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_API_KEY, libraries });

  if (loading || !isLoaded)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-500 font-medium">Preparing your checkout...</p>
      </div>
    );

  if (!items.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 text-center px-4">
        <p className="text-gray-500 font-medium">Your cart is empty. Please add items before checking out.</p>
        <button onClick={() => window.location.href = '/'} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Back to Shop</button>
      </div>
    );

  return (
    <div className="bg-gray-50/50 min-h-screen lg:py-8 py-5">
      <div className="custom-container">
        <div className="flex flex-col lg:flex-row lg:gap-x-10 items-start">
          <GuestCheckoutForm 
            items={items} 
            distanceMiles={distanceMiles} 
            setDistanceMiles={setDistanceMiles} 
            onShippingMethodChange={setIsPickup} 
            onCouponApplied={setAppliedCoupon} 
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
          />
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

export default GuestCheckoutPage;