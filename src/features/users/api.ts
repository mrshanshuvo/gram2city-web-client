import { AxiosInstance } from "axios";

export const fetchUsersSummary = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/users/summary");
  return res.data;
};

export const fetchStaffList = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/users/staff");
  return res.data;
};

export const searchUsers = async (
  axiosSecure: AxiosInstance,
  email: string,
) => {
  const res = await axiosSecure.get(`/users/search?email=${email}`);
  return res.data;
};

export const updateUserRole = async (
  axiosSecure: AxiosInstance,
  email: string,
  role: string,
) => {
  const res = await axiosSecure.patch(`/users/${email}/role`, { role });
  return res.data;
};

export const fetchUserByEmail = async (
  axiosSecure: AxiosInstance,
  email: string,
) => {
  const res = await axiosSecure.get(`/users/${email}`);
  return res.data;
};

export const fetchUserStats = async (
  axiosSecure: AxiosInstance,
  email: string,
) => {
  const res = await axiosSecure.get(`/user/stats/${email}`);
  return res.data;
};

export const submitFeedback = async (
  axiosSecure: AxiosInstance,
  feedbackData: {
    userName?: string;
    rating: number;
    comment: string;
    category: string;
  },
) => {
  const res = await axiosSecure.post("/feedback", feedbackData);
  return res.data;
};

export const updateUserProfileData = async (
  axiosSecure: AxiosInstance,
  email: string,
  userData: {
    name?: string;
    photoURL?: string;
    phone?: string;
    address?: string;
  },
) => {
  const res = await axiosSecure.patch(`/users/${email}`, userData);
  return res.data;
};
