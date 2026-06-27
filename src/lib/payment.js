import { api } from "./api.js";

export const createPaymentIntentFromCart = async (shippingAddress, shippingMethod, couponCode = null) => {
  const response = await api.post("/payments/create-intent-from-cart", { shippingAddress, shippingMethod, couponCode });
  return response.data; // { success, data: { clientSecret, paymentIntentId, totalAmount, coupon } }
};

export const createPaymentIntent = async (orderId) => {
  const response = await api.post("/payments/create-intent", { orderId });
  return response.data;
};

export const getPaymentStatus = async (orderId) => {
  const response = await api.get(`/payments/status/${orderId}`);
  return response.data;
};
