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
  const res = await axiosSecure.get(`/rider/stats?email=${email}`);
  return res.data;
};
