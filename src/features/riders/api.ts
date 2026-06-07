import { axiosSecure } from "../../api/axios";
import { ReviewData } from "./types";

export const fetchAvailableRiders = async () => {
  const res = await axiosSecure.get("/riders?status=available");
  return res.data;
};

export const fetchAllRiders = async () => {
  const res = await axiosSecure.get("/riders");
  return res.data;
};

export const fetchRiderStats = async (email: string) => {
  const res = await axiosSecure.get(`/rider/stats/${email}`);
  return res.data;
};

export const fetchRiderReviews = async (email: string) => {
  const res = await axiosSecure.get(`/reviews/rider/${email}`);
  return res.data;
};

export const createReview = async (reviewData: ReviewData) => {
  const res = await axiosSecure.post("/reviews", reviewData);
  return res.data;
};

export const fetchRidersByStatus = async (
  status: string,
  params: { page: number; size: number },
) => {
  const res = await axiosSecure.get("/riders", {
    params: { ...params, status },
  });
  return res.data;
};

export const updateRiderStatus = async (
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

export const pickParcel = async (id: string) => {
  const res = await axiosSecure.patch(`/parcels/${id}/pick`);
  return res.data;
};

export const deliverParcel = async (id: string) => {
  const res = await axiosSecure.patch(`/parcels/${id}/deliver`);
  return res.data;
};
