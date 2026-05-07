import { axiosSecure } from "../../api/axios";

export const fetchUserNotifications = async (email: string) => {
  const res = await axiosSecure.get(`/notifications/${email}`);
  return res.data;
};

export const markNotificationRead = async (id: string) => {
  const res = await axiosSecure.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async (email: string) => {
  const res = await axiosSecure.patch(`/notifications/read-all/${email}`);
  return res.data;
};
