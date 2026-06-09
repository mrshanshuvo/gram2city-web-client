"use client";

import { useRouter } from "next/navigation";

import moment from "moment";
import Swal from "sweetalert2";
import {
  FiEye,
  FiDollarSign,
  FiTrash2,
  FiPackage,
  FiFileText,
  FiEdit,
  FiStar,
} from "react-icons/fi";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/authStore";
import ReviewModal from "./ReviewModal";
import { useState } from "react";
import SkeletonLoader from "@/components/Shared/SkeletonLoader/SkeletonLoader";
import { Parcel } from "@/features/parcels/types";
import { fetchUserParcels, deleteParcel } from "@/features/parcels/api";
import { queryKeys } from "@/lib/queryKeys";
import { usePageHeader } from "@/hooks/usePageHeader";

const MyParcels = () => {
  const { user } = useAuthStore();
  const context = {
    searchTerm: "",
    filterStatus: "all",
  };
  const { searchTerm, filterStatus } = context;
  const router = useRouter();
  const queryClient = useQueryClient();

  usePageHeader("My Shipments", "Manage and track your booked parcels");

  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Using real data fetching for better skeleton demonstration
  const { data: parcelsData = [], isLoading } = useQuery<Parcel[]>({
    queryKey: queryKeys.parcels.list(user?.email || undefined),
    queryFn: () => {
      if (!user?.email) return [];
      return fetchUserParcels(user.email);
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
    router.push(`/dashboard/user/parcels/${parcelId}/payment`);
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
        await deleteParcel(parcelId);
        await queryClient.invalidateQueries({
          queryKey: queryKeys.parcels.list(user?.email || undefined),
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your parcel has been deleted.",
          icon: "success",
        });
      } catch (error: unknown) {
        Swal.fire({
          title: "Error!",
          text:
            (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to delete the parcel",
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
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th
                  scope="col"
                  className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  Package Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  Timeline
                </th>
                <th
                  scope="col"
                  className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  Costing
                </th>
                <th
                  scope="col"
                  className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  Payment
                </th>
                <th
                  scope="col"
                  className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  Manage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {filteredParcels.map((parcel: Parcel, index: number) => (
                <tr
                  key={parcel._id}
                  className="hover:bg-slate-50/30 transition-colors group"
                >
                  <td className="px-8 py-6 whitespace-nowrap text-xs font-bold text-slate-400">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${
                          parcel.parcelType === "Document"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {parcel.parcelType === "Document" ? (
                          <FiFileText size={18} />
                        ) : (
                          <FiPackage size={18} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">
                          {parcel.parcelName}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {parcel.parcelType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-600">
                      {moment(parcel.creation_date).format("MMM D, YYYY")}
                    </div>
                    <div className="text-[10px] font-medium text-slate-400">
                      {moment(parcel.creation_date).format("h:mm A")}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-black text-[#1E5AA8]">
                      ৳{parcel.cost}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Total Fee
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        parcel.payment_status === "paid"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {parcel.payment_status === "paid" ? "● Paid" : "○ Unpaid"}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        parcel.delivery_status === "not_collected"
                          ? "bg-slate-100 text-slate-500"
                          : parcel.delivery_status === "on_the_way"
                            ? "bg-blue-50 text-blue-600"
                            : parcel.delivery_status === "delivered"
                              ? "bg-indigo-50 text-indigo-600"
                              : "bg-red-50 text-red-600"
                      }`}
                    >
                      {parcel.delivery_status}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/user/parcels/${parcel._id}`)
                        }
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>

                      {parcel.delivery_status === "not_collected" && (
                        <button
                          onClick={() =>
                            router.push(`/dashboard/user/parcels/${parcel._id}/edit`)
                          }
                          className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all"
                          title="Edit Shipment"
                        >
                          <FiEdit size={18} />
                        </button>
                      )}

                      {parcel.payment_status !== "paid" && (
                        <button
                          onClick={() => handlePay(parcel._id)}
                          className="p-2.5 bg-accent/10 hover:bg-accent/20 text-[#F4C20D] rounded-xl transition-all"
                          title="Pay Now"
                        >
                          <FiDollarSign size={18} />
                        </button>
                      )}

                      {parcel.delivery_status === "delivered" && (
                        <button
                          onClick={() => {
                            setSelectedParcel(parcel);
                            setShowReviewModal(true);
                          }}
                          className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-500 rounded-xl transition-all"
                          title="Review Rider"
                        >
                          <FiStar size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(parcel._id)}
                        className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-all"
                        title="Cancel Shipment"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showReviewModal && selectedParcel && (
        <ReviewModal
          parcel={selectedParcel}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() =>
            queryClient.invalidateQueries({
              queryKey: queryKeys.parcels.list(user?.email || undefined),
            })
          }
        />
      )}
    </div>
  );
};

export default MyParcels;
