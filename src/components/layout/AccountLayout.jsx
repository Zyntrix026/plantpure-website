import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Loader2,
  Star,
} from "lucide-react";
import { logout } from "../../lib/auth";
import { getProfile } from "../../lib/profile"; // API import

const AccountLayout = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch User Data for Sidebar
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getProfile();
        // API response structure handle karein
        const user = response?.data || response?.data?.data || response?.user;
        setUserData(user);
      } catch (error) {
        console.error("Error fetching profile for layout:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  // Initials nikalne ka logic (e.g., "Shahrukh Khan" -> "SK")
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center justify-between py-4 px-5 no-underline transition-all duration-300 rounded-lg group ${
      isActive
        ? "bg-primary text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-primary"
    }`;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="custom-container flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-80 flex flex-col gap-4">
          {/* User Briefing Card */}
          <div className="bg-white p-5 shadow-sm rounded-xl border border-gray-100 flex items-center gap-4">
            {loading ? (
              <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xl">
                {getInitials(userData?.name)}
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500">Hello,</p>
              {loading ? (
                <div className="h-4 w-24 bg-gray-100 animate-pulse rounded mt-1" />
              ) : (
                <h3 className="text-lg text-primary leading-none font-bold">
                  {userData?.name || "User"}
                </h3>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Account Settings
              </h2>
            </div>

            <div className="p-2 flex flex-col gap-1">
              <NavLink to="/account/profile" className={navLinkClass}>
                <div className="flex items-center gap-3">
                  <User size={20} />
                  <span className="font-semibold">Profile Information</span>
                </div>
                <ChevronRight
                  size={16}
                  className="opacity-50 group-hover:translate-x-1 transition-transform"
                />
              </NavLink>

              <NavLink to="/account/orders" className={navLinkClass}>
                <div className="flex items-center gap-3">
                  <Package size={20} />
                  <span className="font-semibold">My Orders</span>
                </div>
                <ChevronRight
                  size={16}
                  className="opacity-50 group-hover:translate-x-1 transition-transform"
                />
              </NavLink>

              <NavLink to="/account/addresses" className={navLinkClass}>
                <div className="flex items-center gap-3">
                  <MapPin size={20} />
                  <span className="font-semibold">Manage Addresses</span>
                </div>
                <ChevronRight
                  size={16}
                  className="opacity-50 group-hover:translate-x-1 transition-transform"
                />
              </NavLink>
              <NavLink to="/account/reviews" className={navLinkClass}>
                <div className="flex items-center gap-3">
                  <Star size={20} />
                  <span className="font-semibold"> Reviews</span>
                </div>
                <ChevronRight
                  size={16}
                  className="opacity-50 group-hover:translate-x-1 transition-transform"
                />
              </NavLink>

              <hr className="my-2 border-gray-100" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-4 px-5 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full text-left font-semibold"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 bg-white p-6 md:p-10 shadow-sm rounded-xl border border-gray-100 min-h-[600px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
