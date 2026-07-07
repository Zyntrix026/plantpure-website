import { api } from "./api.js";

// 1. Get published blogs with pagination
export const getPublishedBlogs = async (page = 1) => {
  try {
    const response = await api.get(`/blogs`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch published blogs",
    );
  }
};

// 2. Get all blogs (Sitemap/Admin)
export const getAllSiteMapBlogs = async () => {
  try {
    const response = await api.get("/blogs/getall");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch all blogs",
    );
  }
};

// 3. Get recent articles
export const getRecentArticles = async () => {
  try {
    const response = await api.get("/blogs/recent");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch recent articles",
    );
  }
};

// 4. Get blog by slug
export const getBlogBySlug = async (slug) => {
  try {
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch blog details",
    );
  }
};
