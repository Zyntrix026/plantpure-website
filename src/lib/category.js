import { api } from "./api.js";

export const getCategories = async () => {
  try {
    const { data } = await api.get("/categories");
    return data;
  } catch (error) {
    console.error("Categories Fetch Error:", error);
    return { success: false, categoryList: [] };
  }
};
