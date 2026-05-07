import { AxiosInstance } from "axios";
import { LandingItem, LandingConfig } from "./types";

export const fetchLandingData = async (
  axiosSecure: AxiosInstance,
  type: string,
) => {
  const endpoint = type === "processSteps" ? "process-steps" : type;
  const res = await axiosSecure.get(`/landing/${endpoint}`);
  return res.data.data;
};

export const fetchAvatars = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/avatars");
  return res.data;
};

export const fetchLandingConfig = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/landing/config");
  return res.data.data;
};

export const createLandingItem = async (
  axiosSecure: AxiosInstance,
  type: string,
  data: LandingItem,
) => {
  const endpoint = type === "processSteps" ? "process-steps" : type;
  const res = await axiosSecure.post(`/landing/${endpoint}`, data);
  return res.data;
};

export const updateLandingItem = async (
  axiosSecure: AxiosInstance,
  type: string,
  id: string,
  data: LandingItem,
) => {
  const endpoint = type === "processSteps" ? "process-steps" : type;
  const res = await axiosSecure.patch(`/landing/${endpoint}/${id}`, data);
  return res.data;
};

export const deleteLandingItem = async (
  axiosSecure: AxiosInstance,
  type: string,
  id: string,
) => {
  const endpoint = type === "processSteps" ? "process-steps" : type;
  const res = await axiosSecure.delete(`/landing/${endpoint}/${id}`);
  return res.data;
};

export const updateLandingConfig = async (
  axiosSecure: AxiosInstance,
  data: Partial<LandingConfig>,
) => {
  const res = await axiosSecure.patch("/landing/config", data);
  return res.data;
};

export const generateAvatars = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.post("/avatars/magic-generate", {
    style: "lorelei",
    count: 12,
  });
  return res.data;
};

export const deleteAvatar = async (axiosSecure: AxiosInstance, id: string) => {
  const res = await axiosSecure.delete(`/avatars/${id}`);
  return res.data;
};
