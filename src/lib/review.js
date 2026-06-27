import { api } from "./api.js";

/**
 * 1. Add a new review
 * Route: POST /review/add
 * @param {Object} reviewData - { productId, rating, comment }
 */
export const addReview = async (reviewData) => {
  try {
    const response = await api.post("/reviews/add", reviewData);
    return response.data; // Expected { success: true, review: {...} }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to submit review";
    throw new Error(errorMessage);
  }
};

/**
 * 2. Update an existing review
 * Route: PUT /review/update/:reviewId
 * @param {string} reviewId
 * @param {Object} updateData - { rating, comment }
 */
export const updateReview = async (reviewId, updateData) => {
  try {
    const response = await api.put(`/reviews/update/${reviewId}`, updateData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update review";
    throw new Error(errorMessage);
  }
};

/**
 * 3. Delete a review
 * Route: DELETE /review/delete/:reviewId
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/delete/${reviewId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete review";
    throw new Error(errorMessage);
  }
};

/**
 * 4. Get current user's review for a specific product
 * Route: GET /review/my/:productId
 * Description: Useful to check if the user has already reviewed the product
 */
export const getMyReview = async () => {
  try {
    const response = await api.get(`/reviews/my`);
    return response.data; // Expected { success: true, review: {...} }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch your review";
    throw new Error(errorMessage);
  }
};

/**
 * 5. Get all reviews for a specific product
 * Route: GET /reviews/product/:productId
 * Description: Product details page par saare user reviews aur ratings show karne ke liye
 * @param {string} productId
 */
export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data; // Expected { success: true, reviews: [...] }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch product reviews";
    throw new Error(errorMessage);
  }
};