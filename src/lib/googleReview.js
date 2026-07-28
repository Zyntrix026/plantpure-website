import { api } from "./api";

/**
 * 1. Fetch All Public Reviews (With optional filters/pagination)
 * Route: GET /reviews
 */
export const getReviews = async (params = {}) => {
  try {
    const response = await api.get("/google-reviews", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error in getReviews API:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch reviews.",
    };
  }
};