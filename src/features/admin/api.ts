import { axiosSecure } from "../../api/axios";
import { SystemSettings } from "./types";

export const fetchAdminStats = async () => {
  const res = await axiosSecure.get("/admin/stats");
  return res.data;
};

export const fetchAllParcels = async (params: {
  page: number;
  size: number;
  status: string;
  startDate: string;
  endDate: string;
}) => {
  const res = await axiosSecure.get("/admin/all-parcels", { params });
  return res.data;
};

export const fetchSystemSettings = async () => {
  const res = await axiosSecure.get("/admin/settings");
  return res.data.settings;
};

export const updateSystemSettings = async (
  newSettings: Partial<SystemSettings>
) => {
  const res = await axiosSecure.patch("/admin/settings", newSettings);
  return res.data;
};

export const fetchFeedback = async () => {
  const res = await axiosSecure.get("/feedback");
  return res.data.data;
};
