import { api } from "./api.js";

// 1. Fetch current user's cart
export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch cart");
  }
};

// 2. Add to cart — supports simple and variant products
// cartData: { items: [{ productId, quantity, variantId? }] }
export const addToCart = async (cartData) => {
  try {
    const response = await api.post("/cart/add", cartData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add to cart");
  }
};

// 3. Decrease qty by 1 (or remove if qty = 1)
// variantId optional — pass for variant products
export const removeProductFromCart = async (productId, variantId = null) => {
  try {
    const url = variantId
      ? `/cart/remove/${productId}?variantId=${variantId}`
      : `/cart/remove/${productId}`;
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to remove product");
  }
};

// 4. Remove item completely (all qty)
export const removeItemCompletely = async (productId, variantId = null) => {
  try {
    const url = variantId
      ? `/cart/remove/${productId}/all?variantId=${variantId}`
      : `/cart/remove/${productId}/all`;
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to remove item");
  }
};

// 5. Update exact quantity
export const updateItemQuantity = async (productId, quantity, variantId = null) => {
  try {
    const url = variantId
      ? `/cart/update/${productId}?variantId=${variantId}`
      : `/cart/update/${productId}`;
    const response = await api.patch(url, { quantity });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update quantity");
  }
};

// 6. Clear entire cart
export const clearCart = async () => {
  try {
    const response = await api.delete("/cart/clear");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to clear cart");
  }
};

// 7. Merge guest cart into user cart after login
// items: [{ productId, quantity, variantId? }]
export const mergeCart = async (items) => {
  try {
    const response = await api.post("/cart/merge", { items });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to merge cart");
  }
};
