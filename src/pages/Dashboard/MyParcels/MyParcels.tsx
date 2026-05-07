import { useOutletContext, useNavigate } from "react-router";
import moment from "moment";
import Swal from "sweetalert2";
import { FiEye, FiDollarSign, FiTrash2, FiPackage } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../features/auth/authStore";
import ReviewModal from "./ReviewModal";
import { FiStar } from "react-icons/fi";
import { useState } from "react";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";
import { Parcel } from "../../../features/parcels/types";
import { fetchUserParcels, deleteParcel } from "../../../features/parcels/api";

interface MyParcelsContext {
  searchTerm: string;
  filterStatus: string;
}

const MyParcels = () => {
  const { user } = useAuthStore();
  const { searchTerm, filterStatus } = useOutletContext<MyParcelsContext>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Using real data fetching for better skeleton demonstration
  const { data: parcelsData = [], isLoading } = useQuery<Parcel[]>({
    queryKey: ["dashboard-parcels", user?.email],
    queryFn: () => {
      if (!user?.email) return [];
      return fetchUserParcels(axiosSecure, user.email);
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-center mb-4">
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <SkeletonLoader type="table" rows={10} />
      </div>
    );
  }

  // Filter parcels based on search and status
  const filteredParcels = parcelsData.filter((parcel: Parcel) => {
    const matchesSearch =
      (parcel.parcelName || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase()) ||
      (parcel.parcelType || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "paid" && parcel.payment_status === "paid") ||
      (filterStatus === "unpaid" && parcel.payment_status !== "paid");

    return matchesSearch && matchesStatus;
  });

  const handlePay = (parcelId: string) => {
    navigate(`/dashboard/payment/${parcelId}`);
  };

  const handleDelete = async (parcelId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteParcel(axiosSecure, parcelId);
        await queryClient.invalidateQueries({
          queryKey: ["dashboard-parcels", user?.email],
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your parcel has been deleted.",
          icon: "success",
        });
      } catch (error: unknown) {
        Swal.fire({
          title: "Error!",
          text: (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete the parcel",
          icon: "error",
        });
      }
    }
  };

  if (filteredParcels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {parcelsData.length === 0
              ? "No parcels yet"
              : "No matching parcels found"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {parcelsData.length === 0
              ? "Get started by creating a new parcel shipment."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                #
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created At
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cost
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParcels.map((parcel: Parcel, index: number) => (
              <tr key={parcel._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    {parcel.parcelType === "Document" ? (
                      <span className="mr-2">📄</span>
                    ) : (
                      <span className="mr-2">📦</span>
                    )}
                    {parcel.parcelType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {parcel.parcelName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {moment(parcel.creation_date).format("MMM D, YYYY h:mm A")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ৳{parcel.cost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      parcel.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                    aria-label={
                      parcel.payment_status === "paid" ? "Paid" : "Unpaid"
                    }
                  >
                    {parcel.payment_status === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/parcels/${parcel._id}`)
                      }
                      className="text-blue-600 hover:text-blue-900"
                      aria-label="View parcel details"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    {parcel.payment_status !== "paid" && (
                      <button
                        onClick={() => handlePay(parcel._id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        aria-label="Pay for parcel"
                      >
                        <FiDollarSign className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="text-red-600 hover:text-red-900"
                      aria-label="Delete parcel"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>

                    {/* Review Button for Delivered Parcels */}
                    {parcel.delivery_status === "delivered" && (
                      <button
                        onClick={() => {
                          setSelectedParcel(parcel);
                          setShowReviewModal(true);
                        }}
                        className="text-amber-500 hover:text-amber-600"
                        title="Review Rider"
                      >
                        <FiStar className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showReviewModal && selectedParcel && (
        <ReviewModal
          parcel={selectedParcel}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() =>
            queryClient.invalidateQueries({
              queryKey: ["dashboard-parcels", user?.email],
            })
          }
        />
      )}
    </div>
  );
};

export default MyParcels;
