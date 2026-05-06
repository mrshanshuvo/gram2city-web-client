import { AxiosInstance } from "axios";

export const fetchUserNotifications = async (axiosSecure: AxiosInstance, email: string) => {
  const res = await axiosSecure.get(`/notifications/${email}`);
  return res.data;
};

export const markNotificationRead = async (axiosSecure: AxiosInstance, id: string) => {
  const res = await axiosSecure.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async (axiosSecure: AxiosInstance, email: string) => {
  const res = await axiosSecure.patch(`/notifications/read-all/${email}`);
  return res.data;
};
