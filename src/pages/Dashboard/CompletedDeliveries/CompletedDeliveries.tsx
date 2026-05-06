import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuthStore } from "../../../features/auth/authStore";
import toast from "react-hot-toast";
import { fetchRiderCashouts, requestCashout } from "../../../features/finance/api";

const CompletedDeliveries = () => {
  const { user } = useAuthStore();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch delivered parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels?rider_email=${user?.email}&delivery_status=delivered`
      );
      return res.data;
    },
  });

  // Fetch cashed out parcel IDs
  const { data: cashedOut = [] } = useQuery({
    queryKey: ["cashedOut", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      if (!user?.email) return [];
      const data = await fetchRiderCashouts(axiosSecure, user.email);
      return data.map((item: any) => item.parcel_id);
    },
  });

  // Mutation for instant cashout
  const cashoutMutation = useMutation({
    mutationFn: (parcelId: string) => requestCashout(axiosSecure, parcelId),
    onSuccess: () => {
      toast.success("Cash out successful");
      queryClient.invalidateQueries({ queryKey: ["completedDeliveries", user?.email] });
      queryClient.invalidateQueries({ queryKey: ["cashedOut", user?.email] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Cash out failed");
    },
  });

  // Calculate total earnings
  const totalEarnings = parcels.reduce((sum: number, p: any) => sum + (p.rider_earning || 0), 0);

  // Loading and empty state
  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (parcels.length === 0)
    return <div className="text-center mt-10">No completed deliveries found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Completed Deliveries</h2>

      <div className="mb-4 text-right text-lg font-medium text-green-700">
        Total Earnings: ৳{totalEarnings.toFixed(2)}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 border">#</th>
              <th className="py-2 px-3 border">Parcel</th>
              <th className="py-2 px-3 border">Tracking ID</th>
              <th className="py-2 px-3 border">Cost</th>
              <th className="py-2 px-3 border">Earning</th>
              <th className="py-2 px-3 border">Picked At</th>
              <th className="py-2 px-3 border">Delivered At</th>
              <th className="py-2 px-3 border">Cashout</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel: any, idx: number) => (
              <tr key={parcel._id} className="text-center">
                <td className="py-2 px-3 border">{idx + 1}</td>
                <td className="py-2 px-3 border">{parcel.parcelName}</td>
                <td className="py-2 px-3 border">{parcel.trackingId}</td>
                <td className="py-2 px-3 border">৳{parcel.cost}</td>
                <td className="py-2 px-3 border text-green-700 font-semibold">
                  ৳{(parcel.rider_earning || 0).toFixed(2)}
                </td>
                <td className="py-2 px-3 border">
                  {parcel.picked_at
                    ? new Date(parcel.picked_at).toLocaleString("en-BD")
                    : "N/A"}
                </td>
                <td className="py-2 px-3 border">
                  {parcel.delivered_at
                    ? new Date(parcel.delivered_at).toLocaleString("en-BD")
                    : "N/A"}
                </td>
                <td className="py-2 px-3 border">
                  {cashedOut.includes(parcel._id) ? (
                    <span className="text-sm text-green-600 font-medium">Cashed Out</span>
                  ) : (
                    <button
                      onClick={() => cashoutMutation.mutate(parcel._id)}
                      className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                      disabled={cashoutMutation.isPending}
                    >
                      Cash Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedDeliveries;
