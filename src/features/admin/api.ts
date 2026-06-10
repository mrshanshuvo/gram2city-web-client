import { axiosSecure } from "../../api/axios";
import { SystemSettings } from "./types";
import { systemSettingsResponseSchema } from "../../lib/responseSchemas";

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
  const res = await axiosSecure.get("/parcels/all", { params });
  return res.data;
};

export const fetchSystemSettings = async () => {
  const res = await axiosSecure.get("/admin/settings");
  const validated = systemSettingsResponseSchema.safeParse(res.data);
  if (validated.success && validated.data.settings) {
    return validated.data.settings;
  }
  return res.data.settings; // Fallback to raw if validation fails (for non-critical parts)
};

export const updateSystemSettings = async (
  newSettings: Partial<SystemSettings>,
) => {
  const res = await axiosSecure.patch("/admin/settings", newSettings);
  return res.data;
};

export const fetchFeedback = async () => {
  const res = await axiosSecure.get("/feedback");
  return res.data.data;
};

export const fetchAllMerchants = async () => {
  const res = await axiosSecure.get("/merchants");
  return res.data;
};

export const updateMerchantStatus = async (id: string, status: string) => {
  const res = await axiosSecure.patch(`/merchants/${id}/status`, {
    status,
  });
  return res.data;
};
