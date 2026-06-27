import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  User,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Heart,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { isAuthenticated, logout } from "../../lib/auth";
import logo from "/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const { cartCount, updateCartCount, count, setOpen: setOpenCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Refs for managing click-outside behavior
  const dropdownRef = useRef(null);

  // Fallback counter logic to support both context naming standards
  const activeCartCount = cartCount !== undefined ? cartCount : count || 0;

  // Sync auth state on route or render change
  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, [location]);

  // Click Outside Handler to close account dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    logout();
    setLoggedIn(false);
    if (typeof updateCartCount === "function") updateCartCount(0);
    navigate("/");
  };

  // Proper page navigation links instead of hash targets
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Products", to: "/products" },
    { label: "Blogs", to: "/blogs" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-foreground/9 bg-[#ffffff] backdrop-blur-md">
        <div className="custom-container flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex size-9 items-center justify-center rounded-full border border-foreground/10 transition-colors hover:bg-foreground/5 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-4" strokeWidth={1.5} />
            </button>

            <Link
              to="/"
              className="flex items-center transition-opacity hover:opacity-90"
              aria-label="PlantPure home"
            >
              <img src={logo} alt="PlantPure Natural" className="w-[65px]" />
            </Link>
          </div>

          {/* ─── CENTER BLOCK: ROUTE ROUTING NAV LINKS ─── */}
          <div className="hidden items-center gap-8 text-xs font-semibold   text-foreground/80 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`group relative py-2 text-sm font-semibold text-foreground/80 hover:text-[var(--terracotta)] transition-colors ${
                  location.pathname === link.to
                    ? "text-[var(--terracotta)]"
                    : ""
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[var(--terracotta)] transition-all duration-300 group-hover:w-full ${
                    location.pathname === link.to ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* ─── RIGHT BLOCK: ACTIONS ─── */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Wishlist Link - Desktop */}
            <Link
              to="/wishlist"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-[var(--terracotta)] transition-colors py-2"
              aria-label="Wishlist"
            >
              <Heart className="size-5" strokeWidth={1.5} />
              <span>Wishlist</span>
            </Link>

            {/* Shopping Cart Trigger */}
            <Link to="/checklist">
              <button
                onClick={() =>
                  typeof setOpenCart === "function" && setOpenCart(true)
                }
                className="group flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-[var(--terracotta)] transition-colors py-2"
                aria-label={`Open cart, ${activeCartCount} items`}
              >
                <div className="relative flex items-center gap-2">
                  <ShoppingCart className="size-5" strokeWidth={1.5} />
                  {activeCartCount > 0 && (
                    <span className="absolute -right-2.5 -top-2.5 grid min-w-4 h-4 px-1 place-items-center rounded-full bg-[#f3d06c] text-[10px] font-bold text-gray-900 shadow-sm animate-scale-in">
                      {activeCartCount}
                    </span>
                  )}
                  <span className="hidden sm:inline">Cart</span>
                </div>
              </button>
            </Link>

            {/* Account Option */}
            <div className="relative" ref={dropdownRef}>
              {loggedIn ? (
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground/80 cursor-pointer group hover:text-[var(--terracotta)] transition-colors py-2"
                >
                  <User className="size-5" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Account</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-semibold text-foreground/80 group hover:text-[var(--terracotta)] transition-colors py-2"
                  aria-label="Account / Login"
                >
                  <User className="size-5" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* Desktop Dropdown Block */}
              {loggedIn && isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-background border border-foreground/10 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                  <Link
                    to="/account/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider text-foreground/80 hover:bg-foreground/5 transition-colors font-semibold"
                  >
                    <LayoutDashboard size={15} strokeWidth={1.8} /> My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider text-red-500 hover:bg-red-50/50 transition-colors font-semibold border-t border-foreground/5"
                  >
                    <LogOut size={15} strokeWidth={1.8} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE SIDEBAR BACKDROP OVERLAY ─── */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* ─── MOBILE SIDEBAR DRAWER ─── */}
      <div
        className={`fixed bottom-0 top-0 left-0 z-50 flex w-[300px] flex-col bg-background p-6 shadow-2xl transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-6 border-b border-foreground/5">
          <img src={logo} alt="PlantPure Natural" className="w-[60px] h-auto" />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex size-9 items-center justify-center rounded-full border border-foreground/10 transition-colors hover:bg-foreground/5"
            aria-label="Close menu"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile Functional Router Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center justify-between text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:text-[var(--terracotta)] ${
                    location.pathname === link.to
                      ? "text-[var(--terracotta)]"
                      : "text-foreground/90"
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="size-4 opacity-0 transition-all -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--terracotta)]" />
                </Link>
              </li>
            ))}

            {/* Wishlist Link - Mobile Layout Divider & Row */}
            <li className="pt-2 border-t border-foreground/5">
              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className={`group flex items-center justify-between text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:text-[var(--terracotta)] ${
                  location.pathname === "/wishlist"
                    ? "text-[var(--terracotta)]"
                    : "text-foreground/90"
                }`}
              >
                <div className="flex items-center gap-3 normal-case tracking-normal">
                  <Heart
                    className="size-4 text-[var(--terracotta)] fill-[var(--terracotta)]/10"
                    strokeWidth={1.5}
                  />
                  <span>My Wishlist</span>
                </div>
                <ChevronRight className="size-4 opacity-0 transition-all -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--terracotta)]" />
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Interactive Utility Footer Area */}
        <div className="border-t border-foreground/5 pt-6">
          {loggedIn ? (
            <div className="space-y-3">
              <Link
                to="/account/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-foreground/10 p-3 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition-colors hover:bg-foreground hover:text-background"
              >
                <LayoutDashboard className="size-4" strokeWidth={1.5} />
                <span>My Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs font-semibold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-500 hover:text-white"
              >
                <LogOut className="size-4" strokeWidth={1.5} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-foreground/10 p-3 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition-colors hover:bg-foreground hover:text-background"
            >
              <User className="size-4" strokeWidth={1.5} />
              <span>Login / Register</span>
            </Link>
          )}

          <div className="mt-6 text-[10px] uppercase tracking-widest text-foreground/40 font-medium">
            © 2026 PlantPure Naturals <br />
            Devised in Japan · Crafted in India
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
