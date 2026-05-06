import { AxiosInstance } from "axios";

export const fetchConversations = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/messages/conversations");
  return res.data.data;
};

export const fetchMessages = async (
  axiosSecure: AxiosInstance,
  conversationId: string,
) => {
  const res = await axiosSecure.get(`/messages/${conversationId}`);
  return res.data.data;
};

export const uploadFile = async (axiosSecure: AxiosInstance, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await axiosSecure.post("/upload", formData);
  return res.data.url;
};
