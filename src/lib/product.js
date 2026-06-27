import { api } from "./api.js";

/**
 * Get all products (supports pagination, filters, and search via params)
 */

export const getProductsByCategory = async (slug, params = {}) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = "newest",
      includeSubCats = "true",
      search = "", // Search parameter add kiya
    } = params;

    const response = await api.get(`/categories/${slug}`, {
      params: { page, limit, sort, includeSubCats, search }, // Backend ko bheja
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch products";
    throw new Error(errorMessage);
  }
};

// Get Single Product by Slug
export const getProductBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/products/details/${slug}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch product data by slug",
    );
  }
};

/**
 * Fetch only active banners for the hero section (Sorted by priority)
 */

export const getActiveBanners = async () => {
  try {
    const { data } = await api.get("/banner/active");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch banners");
  }
};

// --- PUBLIC API (For Home Page) ---
export const getPublicDeals = async () => {
  try {
    const { data } = await api.get("/deals/get-deals");
    return data;
  } catch (error) {
    console.error("Public Deals Fetch Error:", error);
    return null; // Silent failure for public UI
  }
};

// Frontend par popular products dikhane ke liye
export const getPublicPopularProducts = async () => {
  try {
    const { data } = await api.get("/popular/get-popular-products");
    return data;
  } catch (error) {
    console.error("Public Popular Products Fetch Error:", error);
    return null;
  }
};

export const getProductsByIds = async (ids) => {
  try {
    const { data } = await api.post("/products/public/by-ids", { ids });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};

// Search results page — query + category filter + pagination
export const searchProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products/search", { params });
    return data;
  } catch (error) {
    console.error("Search Products Error:", error);
    return { success: false, data: [], totalProducts: 0, totalPages: 0 };
  }
};

// Search bar mein auto-suggestions fetch karne ke liye
export const getSearchSuggestions = async (query) => {
  try {
    if (!query || query.trim().length < 2) return { success: true, data: [] };
    const { data } = await api.get(`/products/search/suggestions?q=${query}`);
    return data;
  } catch (error) {
    console.error("Search Suggestions Fetch Error:", error);
    return { success: false, data: [] };
  }
};

// Related products fetch karne ke liye, product details page par dikhane ke liye
export const getRelatedProducts = async (productId) => {
  try {
    const { data } = await api.get(`/products/related/${productId}`);

    if (data?.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Related Products Fetch Error:", error);
    return [];
  }
};


/**
 * Get single product by id (for Product Details page)
 */
export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/review/product-details/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Product not found");
  }
};


/**
 * सभी प्रोडक्ट्स को फ़ेच करने के लिए API यूटिलिटी फ़ंक्शन
 * @param {Object} params - फ़िल्टर, सॉर्टिंग और पैजिनेशन पैरामीटर्स
 * @returns {Promise<Object>} Backend API रिस्पॉन्स डेटा
 */
export const getProducts = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "newest",
      status = "All Products",
      category = "All",
      search = "",
    } = params;

    const response = await api.get("/products", {
      params: { 
        page, 
        limit, 
        sort, 
        status, 
        category, 
        search 
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch products";
    throw new Error(errorMessage);
  }
};