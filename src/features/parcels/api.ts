import { AxiosInstance } from "axios";

export const fetchUserParcels = async (
  axiosSecure: AxiosInstance,
  email: string,
) => {
  const res = await axiosSecure.get(`/parcels?email=${email}`);
  const data = res.data;
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];
};

export const fetchRiderParcels = async (
  axiosSecure: AxiosInstance,
  email: string,
  status?: string,
) => {
  const url = status
    ? `/parcels?rider_email=${email}&delivery_status=${status}`
    : `/parcels?rider_email=${email}`;
  const res = await axiosSecure.get(url);
  return res.data;
};

export const fetchAssignedParcels = async (axiosSecure: AxiosInstance) => {
  const res = await axiosSecure.get("/rider/parcels");
  return res.data.data;
};

export const deleteParcel = async (
  axiosSecure: AxiosInstance,
  parcelId: string,
) => {
  const res = await axiosSecure.delete(`/parcels/${parcelId}`);
  return res.data;
};

export const updateParcelStatus = async (
  axiosSecure: AxiosInstance,
  parcelId: string,
  status: string,
) => {
  const res = await axiosSecure.patch(`/parcels/${parcelId}`, { status });
  return res.data;
};

export const fetchParcelTracking = async (
  axiosSecure: AxiosInstance,
  trackingId: string,
) => {
  const res = await axiosSecure.get(`/trackings/${trackingId}`);
  return res.data;
};

export const updateRiderParcelStatus = async (
  axiosSecure: AxiosInstance,
  parcelId: string,
  status: string,
) => {
  const res = await axiosSecure.patch(`/rider/parcels/${parcelId}/status`, {
    delivery_status: status,
  });
  return res.data;
};

export const markParcelAsPicked = async (
  axiosSecure: AxiosInstance,
  parcelId: string,
) => {
  const res = await axiosSecure.patch(`/parcels/${parcelId}/pick`);
  return res.data;
};

export const assignRider = async (
  axiosSecure: AxiosInstance,
  parcelId: string,
  riderId: string,
) => {
  const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
    riderId,
    delivery_status: "assigned",
  });
  return res.data;
};
