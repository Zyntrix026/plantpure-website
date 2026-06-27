import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Loader2,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login, forgotPassword, verifyOtp, resetPassword } from "../lib/auth";
import { mergeCart } from "../lib/cart";
import { getGuestCart, clearGuestCart } from "../lib/guestCart";
import { mergeWishlist } from "../lib/wishlist";
import { getGuestWishlist, clearGuestWishlist } from "../lib/guestWishlist";

// ─── MINIMAL FORGOT PASSWORD COMPONENT ───────────────────────────────────────
const ForgotPassword = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email is required");
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep(2);
      toast.success("OTP sent to your email!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp) return setError("OTP is required");
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      setResetToken(res.resetToken);
      setStep(3);
      toast.success("OTP verified successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOriginalResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      toast.success("Password reset successful! Please login.");
      onBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepTitle = {
    1: "Forgot Password",
    2: "Verification",
    3: "Secure Account",
  };
  const stepDesc = {
    1: "Enter your email address to receive a secure recovery OTP.",
    2: `We've sent a 6-digit verification code to ${email}.`,
    3: "Set a strong password to complete the reset process.",
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center cursor-pointer gap-2 text-xs font-bold uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft
          size={14}
          className="transform group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back to Sign In
      </button>

      {/* <div className="mb-5 inline-flex items-center justify-center size-12 rounded-2xl bg-foreground/5 text-foreground border border-foreground/10 shadow-sm animate-pulse">
        <KeyRound size={20} strokeWidth={1.5} />
      </div> */}

      <h2 className="text-2xl sm:text-3xl  font-semibold text-foreground tracking-tight">
        {stepTitle[step]}
      </h2>
      <p className="text-foreground/60 mt-2 text-sm mb-8 leading-relaxed">
        {stepDesc[step]}
      </p>

      {/* Progress Line */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? "bg-foreground scale-x-100" : "bg-foreground/10 scale-x-95"}`}
          />
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: INPUT EMAIL */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest block pl-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-4 text-foreground/40" />
              <input
                type="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full h-12 bg-foreground/[0.01] border border-foreground/10 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 rounded-2xl pl-11 pr-4 text-sm sm:text-base outline-none transition-all placeholder:text-foreground/30 shadow-inner"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-foreground text-background font-semibold rounded-full uppercase tracking-widest text-xs shadow-md hover:bg-foreground/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              "Send Code"
            )}
          </button>
        </form>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest block text-center">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              className="w-full h-12 tracking-[0.5em] text-center font-mono text-xl font-bold bg-foreground/[0.01] border border-foreground/10 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 rounded-2xl outline-none transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-foreground text-background font-semibold rounded-full uppercase tracking-widest text-xs shadow-md hover:bg-foreground/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              "Verify & Advance"
            )}
          </button>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full text-sm text-foreground/60 hover:text-foreground font-semibold text-center mt-2 underline underline-offset-4 transition-colors"
          >
            Resend Code
          </button>
        </form>
      )}

      {/* STEP 3: RESET CODE */}
      {step === 3 && (
        <form onSubmit={handleOriginalResetPassword} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest block pl-1">
              New Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-4 text-foreground/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Choose a strong password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                className="w-full h-12 bg-foreground/[0.01] border border-foreground/10 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 rounded-2xl pl-11 pr-11 text-sm sm:text-base outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-foreground/40 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-foreground text-background font-semibold rounded-full uppercase tracking-widest text-xs shadow-md hover:bg-foreground/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

// ─── MAIN USER LOGIN ─────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Minimum 6 characters required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result) {
        toast.success("Welcome back!");
        await handlePostLogin();
      }
    } catch (error) {
      toast.error(error.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostLogin = async () => {
    const guestCartItems = getGuestCart();
    const guestWishlistIds = getGuestWishlist();
    await Promise.all([
      guestCartItems.length > 0
        ? mergeCart(
            guestCartItems.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              ...(i.variantId ? { variantId: i.variantId } : {}),
            })),
          ).catch(() => {})
        : Promise.resolve(),
      guestWishlistIds.length > 0
        ? mergeWishlist(
            guestWishlistIds.map((i) => ({
              productId: typeof i === "object" ? i._id || i.productId : i,
              variantId: typeof i === "object" ? i.variantId || null : null,
            })),
          ).catch(() => {})
        : Promise.resolve(),
    ]);
    clearGuestCart();
    clearGuestWishlist();
    navigate(guestCartItems.length > 0 ? "/checklist" : "/");
  };

  return (
    <div className="custom-container min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background font-sans antialiased text-foreground">
      {/* LEFT SIDE: BRANDING/GREETING SECTION (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#FAFAFA] border-r border-foreground/5 p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative subtle background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-foreground/[0.02] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-foreground/[0.01] blur-[100px] pointer-events-none" />

        {/* Upper Brand Identity using imported logo from /public */}
        <div className="flex items-center gap-3.5 relative z-10">
          <img src="/logo.png" alt="Plant Pure Logo" className="w-[80px]" />
        </div>

        {/* Core Marketing Content */}
        <div className="space-y-8 max-w-sm relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/5 rounded-full text-xs font-bold uppercase tracking-wider text-foreground/70 shadow-sm backdrop-blur-md">
            <Sparkles
              size={12}
              className="text-yellow-600 fill-yellow-600 animate-spin-slow"
            />{" "}
            Curated Experience
          </div>
          <h1 className="text-4xl  font-light leading-[1.25] text-foreground tracking-tight">
            Discover a refined way of{" "}
            <span className="italic font-normal text-foreground/90">
              shopping
            </span>
            .
          </h1>
          <p className="text-sm text-foreground/50 leading-relaxed font-normal">
            Welcome back to your curated space. Log in to explore fresh seasonal
            collections, synchronized carts, and an optimized interface tailored
            for swift discovery.
          </p>
        </div>

        {/* Lower Footnote */}
        <div className="text-xs text-foreground/40 font-medium tracking-wide relative z-10">
          © {new Date().getFullYear()} Plant Pure. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM WORKFLOW (Full screen on mobile, 7 columns on Desktop) */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-4 sm:p-16 md:p-24 relative bg-background">
        <div className="w-full max-w-md">
          {showForgot ? (
            <ForgotPassword onBack={() => setShowForgot(false)} />
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Mobile-only logo display so that branding remains visible on mobile viewports */}
              <img
                src="/logo.png"
                alt="Plant Pure Logo"
                className="w-[80px] mx-auto mb-6 lg:hidden"
              />

              <div className="mb-2">
                <h2 className="text-3xl sm:text-4xl  font-semibold  text-foreground">
                  Login
                </h2>
                <p className="text-sm text-foreground/50 mt-2">
                  Access your curated profile and orders
                </p>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest block pl-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={16}
                    className={`absolute left-4 z-10 transition-colors duration-200 ${errors.email ? "text-red-500" : "text-foreground/40"}`}
                  />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full h-12 bg-foreground/[0.01] border rounded-2xl pl-11 pr-4 text-sm sm:text-base outline-none transition-all placeholder:text-foreground/30 shadow-inner focus:ring-2 ${
                      errors.email
                        ? "border-red-500/60 focus:ring-red-500/10"
                        : "border-foreground/10 focus:border-foreground/30 focus:ring-foreground/5"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs font-medium pl-1 animate-in fade-in duration-200">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs font-semibold cursor-pointer text-foreground/60 hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    Forgot Password
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock
                    size={16}
                    className={`absolute left-4 z-10 transition-colors duration-200 ${errors.password ? "text-red-500" : "text-foreground/40"}`}
                  />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full h-12 bg-foreground/[0.01] border rounded-2xl pl-11 pr-11 text-sm sm:text-base outline-none transition-all shadow-inner focus:ring-2 ${
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
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs font-medium pl-1 animate-in fade-in duration-200">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-foreground text-background font-semibold rounded-full uppercase tracking-widest text-xs shadow-md hover:bg-foreground/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin size-5" /> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              {/* CREATE ACCOUNT LINK */}
              <div className="text-center pt-3">
                <p className="text-sm text-foreground/50 font-medium">
                  New to our store?{" "}
                  <Link
                    to="/signup"
                    className="text-foreground font-bold underline underline-offset-4 hover:opacity-80 transition-opacity"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              {/* SECURITY VERIFICATION FOOTER MARK */}
              <div className="pt-5 border-t border-foreground/5 flex items-center justify-center gap-2 text-foreground/40">
                <ShieldCheck size={14} className="text-emerald-600/70" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  End-to-End Secure connection
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
