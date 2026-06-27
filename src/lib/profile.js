import {api} from "./api"; // Aapka axios instance

/**
 * Fetch Logged-in User Profile
 */
export const getProfile = async () => {
  try {
    const { data } = await api.get("/users/profile");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};

/**
 * Update User Profile (Name, Phone, Gender, Avatar)
 */
export const updateProfile = async (profileData) => {
  try {
    const { data } = await api.patch("/users/profile", profileData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
};

/**
 * Change User Password
 */
export const changePassword = async (passwordData) => {
  try {
    const { data } = await api.patch("/users/change-password", passwordData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to change password");
  }
};

/**
 * Add New Address to User Profile
 */
export const addAddress = async (addressData) => {
  try {
    const { data } = await api.post("/users/addresses", addressData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add address");
  }
};

/**
 * Update Specific Address
 */
export const updateAddress = async (addressId, addressData) => {
  try {
    const { data } = await api.patch(`/users/addresses/${addressId}`, addressData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update address");
  }
};

/**
 * Delete Address
 */
export const deleteAddress = async (addressId) => {
  try {
    const { data } = await api.delete(`/users/addresses/${addressId}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete address");
  }
};

/**
 * Set an Address as Default
 */
export const setDefaultAddress = async (addressId) => {
  try {
    const { data } = await api.patch(`/users/addresses/${addressId}/default`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to set default address");
  }
};