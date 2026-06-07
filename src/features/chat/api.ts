import { axiosSecure } from "../../api/axios";

export const fetchConversations = async () => {
  const res = await axiosSecure.get("/messages/conversations");
  return res.data.data;
};

export const fetchMessages = async (conversationId: string) => {
  const res = await axiosSecure.get(`/messages/${conversationId}`);
  return res.data.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await axiosSecure.post("/messages/upload-image", formData);
  return res.data.url;
};
