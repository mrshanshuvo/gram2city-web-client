import { AxiosInstance } from "axios";

export const fetchPaymentHistory = async (
  axiosSecure: AxiosInstance,
  email: string,
) => {
  const res = await axiosSecure.get(`/payments?email=${email}`);
  return Array.isArray(res.data.data) ? res.data.data : [];
};

export const fetchRiderCashouts = async (
  axiosSecure: AxiosInstance,
  email: string,
) => {
  const res = await axiosSecure.get(`/cashouts?rider_email=${email}`);
  return res.data;
};

export const requestCashout = async (
  axiosSecure: AxiosInstance,
  parcelId: string,
) => {
  const res = await axiosSecure.post("/rider/cashout", { parcelId });
  return res.data;
};
