import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckoutAuthDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Handle Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const drawerContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100000] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#faf9f6] text-foreground/90 z-[100001] shadow-2xl border-l border-foreground/5 transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
        <div className="p-6 sm:p-8 h-full flex flex-col justify-between bg-[#faf9f6]">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold uppercase text-foreground">
                Checkout as a member
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5 rounded-full transition-all"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-8">
              Log in or sign up to get the premium experience.
            </p>

            {/* Premium Benefits List */}
            <ul className="space-y-4 mb-10">
              {[
                "Earn loyalty points and save on your next order.",
                "Get access to exclusive luxury offers and curated deals.",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3.5 text-xs font-medium tracking-wide text-foreground/80 leading-relaxed"
                >
                  <CheckCircle2
                    className="text-[var(--terracotta)] mt-0.5 shrink-0"
                    size={16}
                    strokeWidth={2}
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons Block */}
          <div className="space-y-4 mt-auto">
            {/* Primary Member Button */}
            <button
              onClick={() => {
                onClose();
                navigate("/login");
              }}
              className="w-full py-4 bg-foreground text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-[var(--terracotta)]/10 hover:bg-foreground/90 hover:scale-[1.01] transition-all"
            >
              Continue to Login
            </button>

            {/* Premium Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-foreground/10"></div>
              <span className="flex-shrink mx-4 text-foreground/30 text-[10px] font-bold uppercase tracking-widest">
                or
              </span>
              <div className="flex-grow border-t border-foreground/10"></div>
            </div>

            {/* Secondary Guest Button */}
            <button
              onClick={() => {
                onClose();
                navigate("/guest-checkout");
              }}
              className="w-full py-4 bg-background border border-foreground/20 text-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-foreground/[0.02] hover:border-foreground/40 hover:scale-[1.01] transition-all"
            >
              Check out as guest
            </button>

            {/* Footer Terms Note */}
            <div className="pt-6 text-center text-[10px] text-foreground/40 font-medium tracking-wide">
              By continuing, you agree to our Terms & Conditions.
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(drawerContent, document.body);
};

export default CheckoutAuthDrawer;
