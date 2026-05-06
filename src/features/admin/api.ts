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
