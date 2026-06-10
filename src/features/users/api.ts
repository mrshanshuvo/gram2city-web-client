import { axiosSecure } from "../../api/axios";

export const fetchUsersSummary = async () => {
  const res = await axiosSecure.get("/users/summary");
  return res.data;
};

export const fetchStaffList = async () => {
  const res = await axiosSecure.get("/users/staff");
  return res.data;
};

export const searchUsers = async (email: string) => {
  const res = await axiosSecure.get(`/users/search?email=${email}`);
  return res.data;
};

export const updateUserRole = async (email: string, role: string) => {
  const res = await axiosSecure.patch(`/users/${email}/role`, { role });
  return res.data;
};

export const updateUserStatus = async (email: string, status: string) => {
  const res = await axiosSecure.patch(`/users/${email}/status`, { status });
  return res.data;
};

export const fetchUserByEmail = async (email: string) => {
  const res = await axiosSecure.get(`/users/${email}`);
  return res.data;
};

export const fetchUserStats = async (email: string) => {
  const res = await axiosSecure.get(`/user/stats/${email}`);
  return res.data;
};


export const updateUserProfileData = async (
  email: string,
  userData: {
    name?: string;
    photoURL?: string;
    phone?: string;
    address?: string;
  }
) => {
  const res = await axiosSecure.patch(`/users/${email}`, userData);
  return res.data;
};
