import { AxiosInstance } from "axios";

export const fetchAdminStats = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/admin/stats");
  return res.data;
};

export const fetchAllParcels = async (
  axiosSecure: AxiosInstance,
  params: {
    page: number;
    size: number;
    status: string;
    startDate: string;
    endDate: string;
  },
) => {
  const res = await axiosSecure.get("/admin/all-parcels", { params });
  return res.data;
};

export const fetchSystemSettings = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/admin/settings");
  return res.data.settings;
};

export const updateSystemSettings = async (
  axiosSecure: AxiosInstance,
  newSettings: any,
) => {
  const res = await axiosSecure.patch("/admin/settings", newSettings);
  return res.data;
};

export const fetchFeedback = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/feedback");
  return res.data.data;
};
