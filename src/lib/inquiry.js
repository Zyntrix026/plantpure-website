import { api } from "./api";

export const createInquiry = async (inquiryData) => {
  try {
    const response = await api.post(`/inquiries`, inquiryData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to submit inquiry"
    );
  }
};