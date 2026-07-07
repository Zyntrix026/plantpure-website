import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetails";
import Login from "./pages/Login";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { isAuthenticated } from "./lib/auth";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import CheckList from "./pages/Checklist";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import CheckoutPage from "./pages/Checkout";
import GuestCheckoutPage from "./pages/GuestCheckoutPage";
import AccountLayout from "./components/layout/AccountLayout";
import Profile from "./pages/account/Profile";
import Orders from "./pages/account/Orders";
import Addresses from "./pages/account/Addresses";
import AddReview from "./pages/account/AddReview";
import Reviews from "./pages/account/Reviews";
import OrderConfirmation from "./pages/OrderConfirmation";
import GuestOrderSuccess from "./pages/account/GuestOrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import ScrollToTop from "./components/layout/ScrollToTop";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import BlogDetails from "./pages/BlogDetails";

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  const excludePaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/checkout",
    "/guest-checkout",
  ];
  const shouldExclude = excludePaths.includes(location.pathname);

  return (
    <>
      {!shouldExclude && <Navbar />}
      {children}
      {!shouldExclude && <Footer />}
    </>
  );
};

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 1500 }} />
      <ScrollToTop/>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About/>} />
          <Route path="/blogs" element={<Blogs/>} />
          <Route path="/blogs/:slug" element={<BlogDetails/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
          <Route path="/terms-of-service" element={<TermsOfService/>} />
          <Route path="/:category/:slug" element={<ProductDetail />} />
          <Route path="/products" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checklist" element={<CheckList />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/guest-checkout" element={<GuestCheckoutPage />} />
          <Route path="/guest-order-success" element={<GuestOrderSuccess />} />
          <Route path="/order-tracking" element={<OrderTracking/>} />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/account/profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="add-review/:id" element={<AddReview />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>
        </Routes>
      </LayoutWrapper>
    </>
  );
}
