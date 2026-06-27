import { api } from "./api.js";

export const createOrderAfterPayment = async ({ paymentIntentId, shippingAddress, shippingMethod }) => {
  const response = await api.post("/orders/create-after-payment", {
    paymentIntentId,
    shippingAddress,
    shippingMethod,
  });
  return response.data; // { success, message, data: { orderId, orderNumber, ... } }
};

export const getMyOrders = async (page = 1, limit = 10) => {
  const response = await api.get("/orders/my-orders", { params: { page, limit } });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id, reason) => {
  const response = await api.post(`/orders/cancel/${id}`, { reason });
  return response.data;
};

export const requestCancellation = async (id, reason) => {
  const response = await api.post(`/orders/request-cancellation/${id}`, { reason });
  return response.data;
};

export const checkDelivery = async (lat, lng) => {
  const response = await api.get("/orders/check-delivery", { params: { lat, lng } });
  return response.data;
};
