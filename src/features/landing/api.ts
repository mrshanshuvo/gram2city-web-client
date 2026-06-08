import { axiosPublic, axiosSecure } from "../../api/axios";
import { LandingItem, LandingConfig } from "./types";

export const fetchLandingData = async (type: string) => {
  const endpoint = type === "processSteps" ? "process-steps" : type;
  const res = await axiosSecure.get(`/landing/${endpoint}?all=true`);
  return res.data.data;
};

export const fetchWarehouses = async () => {
  const res = await axiosPublic.get("/landing/warehouses");
  return res.data.data;
};

export const fetchStats = async () => {
  const res = await axiosPublic.get("/landing/stats");
  return res.data.data;
};

export const fetchAvatars = async () => {
  const res = await axiosSecure.get("/avatars");
  return res.data;
};

export const fetchLandingConfig = async () => {
  const res = await axiosSecure.get("/landing/config");
  return res.data.data;
};

export const createLandingItem = async (
  type: string,
  data: FormData | LandingItem,
) => {
  const endpoint = type === "processSteps" ? "process-steps" : type;
  const res = await axiosSecure.post(`/landing/${endpoint}`, data);
  return res.data;
};

export const updateLandingItem = async (
  type: string,
  id: string,
  data: FormData | LandingItem,
) => {
  const endpoint = type === "processSteps" ? "process-steps" : type;
  const res = await axiosSecure.patch(`/landing/${endpoint}/${id}`, data);
  return res.data;
};

export const deleteLandingItem = async (type: string, id: string) => {
  const endpoint = type === "processSteps" ? "process-steps" : type;
  const res = await axiosSecure.delete(`/landing/${endpoint}/${id}`);
  return res.data;
};

export const updateLandingConfig = async (data: Partial<LandingConfig>) => {
  const res = await axiosSecure.patch("/landing/config", data);
  return res.data;
};

export const generateAvatars = async () => {
  const res = await axiosSecure.post("/avatars/magic-generate", {
    style: "lorelei",
    count: 12,
  });
  return res.data;
};

export const deleteAvatar = async (id: string) => {
  const res = await axiosSecure.delete(`/avatars/${id}`);
  return res.data;
};
