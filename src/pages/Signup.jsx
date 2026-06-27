import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signup } from "../lib/auth";
import { mergeCart } from "../lib/cart";
import { getGuestCart, clearGuestCart } from "../lib/guestCart";
import { mergeWishlist } from "../lib/wishlist";
import { getGuestWishlist, clearGuestWishlist } from "../lib/guestWishlist";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", 
    password: "",
  });

  const [errors, setErrors] = useState({});

  // ================= HANDLE INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, ""); 
      if (onlyNums.length <= 10) {
        setFormData({ ...formData, [name]: onlyNums });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // ================= ADVANCED VALIDATION LOGIC =================
  const validate = () => {
    let tempErrors = {};
    
    if (!formData.name.trim()) {
      tempErrors.name = "Full Name is required";
    } else if (formData.name.trim().length < 4) {
      tempErrors.name = "Name must be at least 4 characters long";
    }
    
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    const phone = formData.phone;
    if (!phone) {
      tempErrors.phone = "Phone number is required";
    } else if (phone.length !== 10) {
      tempErrors.phone = "Phone number must be exactly 10 digits";
    } else {
      const isRepeating = /^(\d)\1{9}$/.test(phone);
      const isSequential = "0123456789876543210".includes(phone);

      if (isRepeating) {
        tempErrors.phone = "Invalid phone number";
      } else if (isSequential) {
        tempErrors.phone = "Invalid phone number";
      }
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ================= POST SIGNUP HANDLER (CART/WISHLIST MERGE) =================
  const handlePostSignup = async () => {
    const guestCartItems = getGuestCart();
    const guestWishlistIds = getGuestWishlist();
    await Promise.all([
      guestCartItems.length > 0
        ? mergeCart(guestCartItems.map((i) => ({ productId: i.productId, quantity: i.quantity, ...(i.variantId ? { variantId: i.variantId } : {}) }))).catch(() => {})
        : Promise.resolve(),
      guestWishlistIds.length > 0
        ? mergeWishlist(guestWishlistIds.map((i) => ({ productId: typeof i === "object" ? (i._id || i.productId) : i, variantId: typeof i === "object" ? (i.variantId || null) : null }))).catch(() => {})
        : Promise.resolve(),
    ]);
    clearGuestCart();
    clearGuestWishlist();
    navigate(guestCartItems.length > 0 ? "/checklist" : "/");
  };

  // ================= FORM SUBMISSION =================
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    
    setLoading(true);
    try {
      const fullPhoneNumber = `+91${formData.phone}`;
      
      const result = await signup(
        formData.email, 
        formData.password, 
        formData.name, 
        fullPhoneNumber
      );

      if (result) {
        toast.success("Welcome! Account created successfully.");
        await handlePostSignup();
      }
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-container h-screen min-h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-background  antialiased text-foreground select-none">
      
      {/* ─── LEFT SIDE: BRANDING PANEL (Desktop only, absolutely non-scrollable) ─── */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#FAFAFA] border-r border-foreground/5 p-12 flex-col justify-between relative overflow-hidden h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-foreground/[0.02] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-foreground/[0.01] blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <img src="/logo.png" alt="Plant Pure Logo" className="w-[70px]" />
        </div>

        <div className="space-y-6 max-w-sm relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/5 rounded-full text-[11px] font-bold uppercase tracking-wider text-foreground/70 shadow-sm backdrop-blur-md">
            <Sparkles size={10} className="text-yellow-600 fill-yellow-600 animate-spin-slow" />{" "}
            Curated Experience
          </div>
          <h1 className="text-3xl   leading-[1.25] text-foreground tracking-tight">
            Discover a refined way of{" "}
            <span className="  font-normal text-foreground/90">shopping</span>.
          </h1>
          <p className="text-xs text-foreground/50 leading-relaxed font-normal">
            Welcome back to your curated space. Log in to explore fresh seasonal collections, synchronized carts, and an optimized interface tailored for swift discovery.
          </p>
        </div>

        <div className="text-[11px] text-foreground/40 font-medium tracking-wide relative z-10">
          © {new Date().getFullYear()} Plant Pure. All rights reserved.
        </div>
      </div>

      {/* ─── RIGHT SIDE: AUTH FORM WORKFLOW (Strictly No Scroll, Optimized for Mobile Screen Height) ─── */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-4 sm:p-12 md:p-16 relative bg-background h-full overflow-hidden">
        <div className="w-full max-w-md my-auto">
          
          <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
            {/* Mobile-only compact logo */}
            <img
              src="/logo.png"
              alt="Plant Pure Logo"
              className="w-[60px] mx-auto mb-2 lg:hidden"
            />

            <div className="mb-2 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl  font-semibold tracking-tight text-foreground">
                Create Account
              </h2>
              <p className="text-xs text-foreground/50 mt-1">
                Access your curated profile and orders
              </p>
            </div>

            {/* FULL NAME */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest block pl-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User
                  size={14}
                  className={`absolute left-4 z-10 transition-colors duration-200 ${errors.name ? "text-red-500" : "text-foreground/40"}`}
                />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Minimum 4 characters"
                  className={`w-full h-10 sm:h-11 bg-foreground/[0.01] border rounded-xl pl-11 pr-4 text-xs sm:text-sm outline-none transition-all placeholder:text-foreground/30 shadow-inner focus:ring-2 ${
                    errors.name
                      ? "border-red-500/60 focus:ring-red-500/10"
                      : "border-foreground/10 focus:border-foreground/30 focus:ring-foreground/5"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="hidden sm:flex text-red-500 text-[11px] font-medium pl-1 items-center gap-1 animate-in fade-in duration-200">
                  {errors.name}
                </p>
              )}
            </div>

            {/* EMAIL ADDRESS */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest block pl-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail
                  size={14}
                  className={`absolute left-4 z-10 transition-colors duration-200 ${errors.email ? "text-red-500" : "text-foreground/40"}`}
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full h-10 sm:h-11 bg-foreground/[0.01] border rounded-xl pl-11 pr-4 text-xs sm:text-sm outline-none transition-all placeholder:text-foreground/30 shadow-inner focus:ring-2 ${
                    errors.email
                      ? "border-red-500/60 focus:ring-red-500/10"
                      : "border-foreground/10 focus:border-foreground/30 focus:ring-foreground/5"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="hidden sm:flex text-red-500 text-[11px] font-medium pl-1 items-center gap-1 animate-in fade-in duration-200">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PHONE NUMBER */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest block pl-1">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone
                  size={14}
                  className={`absolute left-4 z-10 transition-colors duration-200 ${errors.phone ? "text-red-500" : "text-foreground/40"}`}
                />
                <span className="absolute left-11 text-foreground/40 font-bold text-xs select-none border-r pr-1.5 border-foreground/10 z-10">
                  +91
                </span>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`w-full h-10 sm:h-11 bg-foreground/[0.01] border rounded-xl pl-18 pr-4 text-xs sm:text-sm outline-none transition-all placeholder:text-foreground/30 shadow-inner focus:ring-2 ${
                    errors.phone
                      ? "border-red-500/60 focus:ring-red-500/10"
                      : "border-foreground/10 focus:border-foreground/30 focus:ring-foreground/5"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="hidden sm:flex text-red-500 text-[11px] font-medium pl-1 items-center gap-1 animate-in fade-in duration-200">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest block pl-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={14}
                  className={`absolute left-4 z-10 transition-colors duration-200 ${errors.password ? "text-red-500" : "text-foreground/40"}`}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full h-10 sm:h-11 bg-foreground/[0.01] border rounded-xl pl-11 pr-11 text-xs sm:text-sm outline-none transition-all shadow-inner focus:ring-2 ${
                    errors.password
                      ? "border-red-500/60 focus:ring-red-500/10"
                      : "border-foreground/10 focus:border-foreground/30 focus:ring-foreground/5"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-foreground/40 hover:text-foreground z-10 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="hidden sm:flex text-red-500 text-[11px] font-medium pl-1 items-center gap-1 animate-in fade-in duration-200">
                  {errors.password}
                </p>
              )}
            </div>

            {/* SIGNUP SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-11 bg-foreground text-background font-semibold rounded-full uppercase tracking-widest text-[11px] shadow-md hover:bg-foreground/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                "Create Account"
              )}
            </button>

            {/* NAVIGATE TO LOGIN */}
            <div className="text-center pt-1.5">
              <p className="text-xs text-foreground/50 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-foreground font-bold underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  Login here
                </Link>
              </p>
            </div>

            {/* SECURITY VERIFICATION FOOTER */}
            <div className="pt-3 border-t border-foreground/5 flex items-center justify-center gap-1.5 text-foreground/40">
              <ShieldCheck size={12} className="text-emerald-600/70" />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                End-to-End Secure connection
              </span>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}