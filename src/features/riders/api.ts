import { AxiosInstance } from "axios";

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

export const createReview = async (axiosSecure: AxiosInstance, reviewData: any) => {
  const res = await axiosSecure.post("/reviews", reviewData);
  return res.data;
};
