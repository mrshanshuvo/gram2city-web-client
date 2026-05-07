import { AxiosInstance } from "axios";
import { ReviewData } from "./types";

export const fetchAvailableRiders = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/riders?status=available");
  return res.data;
};

export const fetchAllRiders = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/riders");
  return res.data;
};

export const fetchRiderStats = async (axiosSecure: AxiosInstance, email: string) => {
  const res = await axiosSecure.get(`/rider/stats/${email}`);
  return res.data;
};

export const fetchRiderReviews = async (axiosSecure: AxiosInstance, email: string) => {
  const res = await axiosSecure.get(`/reviews/rider/${email}`);
  return res.data;
};

export const createReview = async (axiosSecure: AxiosInstance, reviewData: ReviewData) => {
  const res = await axiosSecure.post("/reviews", reviewData);
  return res.data;
};

export const fetchRidersByStatus = async (
  axiosSecure: AxiosInstance,
  status: string,
  params: { page: number; size: number },
) => {
  const res = await axiosSecure.get("/riders", {
    params: { ...params, status },
  });
  return res.data;
};

export const updateRiderStatus = async (
  axiosSecure: AxiosInstance,
  id: string,
  status: string,
  email?: string,
) => {
  const res = await axiosSecure.patch(`/riders/${id}/status`, {
    status,
    email,
  });
  return res.data;
};
