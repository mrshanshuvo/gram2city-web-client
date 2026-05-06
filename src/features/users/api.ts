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
