import { api } from "./api.js";

/**
 * 1. Fetch current user's wishlist
 * Route: GET /wishlist/
 */
export const getWishlist = async () => {
  try {
    const response = await api.get("/wishlist");
    return response.data; // Expected { success: true, wishlist: [...] }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch wishlist";
    throw new Error(errorMessage);
  }
};

/**
 * 2. Toggle product in wishlist (Add/Remove)
 * Route: POST /wishlist/toggle/:productId
 */
export const toggleWishlist = async (productId, variantId = null) => {
  try {
    const response = await api.post(`/wishlist/toggle/${productId}`, variantId ? { variantId } : {});
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update wishlist";
    throw new Error(errorMessage);
  }
};

/**
 * 3. Check if a product is already in wishlist
 * Route: GET /wishlist/check/:productId
 */
export const checkWishlisted = async (productId) => {
  try {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data; // Expected { success: true, isWishlisted: true/false }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to check wishlist status";
    throw new Error(errorMessage);
  }
};

/**
 * 4. Clear the entire wishlist
 * Route: DELETE /wishlist/clear
 */
export const clearWishlist = async () => {
  try {
    const response = await api.delete("/wishlist/clear");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to clear wishlist";
    throw new Error(errorMessage);
  }
};

export const mergeWishlist = async (items) => {
  try {
    const response = await api.post("/wishlist/merge", { items });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to merge wishlist";
    throw new Error(errorMessage);
  }
};