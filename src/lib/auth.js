import { api } from "./api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const AUTH_KEY = "user_auth_data";

/* =======================
    Auth Storage Helpers (Cookies)
======================= */

// Cookie Configuration 
const sevenDays = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

const COOKIE_CONFIG = {
  expires: sevenDays,
  secure: import.meta.env.MODE === "production",
  sameSite: "strict",
  path: "/",
};

/**
 * @param {Object} data - { token: string, user: any }
 */
export const setAuth = (data) => {
  if (typeof window !== "undefined") {
    // Save as a JSON string in cookies
    Cookies.set(AUTH_KEY, JSON.stringify(data), COOKIE_CONFIG);
    window.dispatchEvent(new Event("authChange"));
  }
};

export const getAuth = () => {
  if (typeof window !== "undefined") {
    const auth = Cookies.get(AUTH_KEY);
    if (!auth) return null;
    try {
      return JSON.parse(auth);
    } catch (e) {
      console.error("Auth cookie parse error:", e);
      return null;
    }
  }
  return null;
};

export const getUser = () => {
  const auth = getAuth();
  return auth?.user || null;
};

export const clearAuth = () => {
  if (typeof window !== "undefined") {
    // Always provide the path when removing cookies
    Cookies.remove(AUTH_KEY, { path: "/" });
    window.dispatchEvent(new Event("authChange"));
  }
};

export const isAuthenticated = () => {
  const auth = getAuth();
  return Boolean(auth?.token);
};

/* =======================
    Auth API Calls
======================= */

const handleAuthResponse = (data) => {
  const token = data?.token || data?.data?.token;
  const user = data?.user || data?.data?.user;

  if (!token) {
    throw new Error("Token not found in response");
  }

  const authData = { token, user };
  setAuth(authData);

  return authData;
};

export const login = async (email, password) => {
  try {
    const { data } = await api.post("/auth/user/login", { email, password });
    handleAuthResponse(data);
    return data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || "User login failed";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
};

export const signup = async (email, password, name, phone) => {
  try {
    const { data } = await api.post("/auth/user/register", {
      email,
      password,
      name,
      phone,
    });
    handleAuthResponse(data);
    return data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Signup failed";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
};

export const googleLogin = async (access_token) => {
  try {
    const { data } = await api.post("/auth/google", { access_token });
    // Google auth returns data.data.token + data.data.user (same shape as regular login)
    const token = data?.data?.token;
    const user  = data?.data?.user;
    if (!token) throw new Error("Token not found in Google auth response");
    setAuth({ token, user });
    return data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Google login failed";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
};



/* =======================
    Logout
======================= */

export const logout = () => {
  clearAuth();
  toast.success("Logged out successfully");
};


export const getCategories = async () => {
  try {
    const { data } = await api.get('/categories/getallsub');
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
};


export const forgotPassword = async (email) => {
  try {
    const { data } = await api.post("/auth/forgot-password", { email });
    toast.success(data.message || "OTP sent to your email!");
    return data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Failed to send OTP";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    return data; // { success, resetToken }
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Invalid OTP";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
};

export const resetPassword = async (resetToken, newPassword) => {
  try {
    const { data } = await api.post("/auth/reset-password", { resetToken, newPassword });
    toast.success(data.message || "Password reset successfully!");
    return data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Failed to reset password";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
};

export const getPageContentApi = async (pageKey) => {
  try {
    const { data } = await api.get(`/legal/public/${pageKey}`);
    return data;
  } catch (error) {
    console.warn(`Initial fetch status for ${pageKey}: Setup record needed.`);
    return null;
  }
};