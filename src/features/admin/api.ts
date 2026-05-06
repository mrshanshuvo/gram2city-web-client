import { AxiosInstance } from "axios";

export const fetchAdminStats = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/admin/stats");
  return res.data;
};
