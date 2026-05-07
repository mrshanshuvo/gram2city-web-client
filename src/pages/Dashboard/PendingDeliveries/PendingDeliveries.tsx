import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../features/auth/authStore";
import { Parcel } from "../../../features/parcels/types";
import {
  fetchAssignedParcels,
  markParcelAsPicked,
  markParcelAsDelivered,
} from "../../../features/parcels/api";
import { 
  FiPackage, 
  FiMapPin, 
  FiPhone, 
  FiClock, 
  FiCheckCircle, 
  FiNavigation,
  FiUser
} from "react-icons/fi";
import moment from "moment";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";
import { usePageHeader } from "../../../hooks/usePageHeader";

const PendingDeliveries: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  usePageHeader("Active Delivery Tasks", "Your current missions for today's shift");

  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch assigned parcels
  const { data: parcels = [], isLoading } = useQuery<Parcel[]>({
    queryKey: ["riderParcels"],
    queryFn: () => fetchAssignedParcels(),
  });

  const pendingParcels = parcels.filter(
    (parcel) => parcel.delivery_status !== "delivered" && parcel.delivery_status !== "cancelled"
  );

  // Pick Mutation
  const pickMutation = useMutation({
    mutationFn: (id: string) => markParcelAsPicked(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riderParcels"] });
      toast.success("Mission Started! Parcel Picked Up.", { icon: "🏍️" });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Pickup failed"),
  });

  // Deliver Mutation
  const deliverMutation = useMutation({
    mutationFn: (id: string) => markParcelAsDelivered(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riderParcels"] });
      setIsModalOpen(false);
      setSelectedParcel(null);
      toast.success("Mission Accomplished! Parcel Delivered.", { icon: "✅" });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Delivery failed"),
  });

  if (isLoading) {
    return <div className="space-y-6"><SkeletonLoader type="card" /><SkeletonLoader type="card" /></div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {pendingParcels.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <FiNavigation size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">No Active Missions</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            Enjoy your break! New delivery tasks will appear here once assigned by dispatch.
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {pendingParcels.map((parcel) => (
            <div key={parcel._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="p-8 flex flex-col md:flex-row gap-8">
                {/* Left Side: Parcel Info & Status */}
                <div className="md:w-1/3 border-r border-slate-50 pr-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                      parcel.delivery_status === 'on_the_way' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {parcel.delivery_status === 'on_the_way' ? <FiTruck /> : <FiPackage />}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">{parcel.parcelName}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {parcel.trackingId}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <FiClock className="text-slate-300" />
                      <span>Ordered {moment(parcel.creation_date).fromNow()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-black text-[#1E5AA8]">
                      <FiDollarSign className="text-slate-300" />
                      <span>COD: ৳{parcel.codAmount || 0}</span>
                    </div>
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      parcel.delivery_status === 'on_the_way' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {parcel.delivery_status.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Right Side: Address & Contacts */}
                <div className="flex-1 grid md:grid-cols-2 gap-8">
                  {/* Pickup */}
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FiMapPin /> Pickup Point
                    </h4>
                    <div className="space-y-2">
                      <div className="font-black text-slate-800 flex items-center gap-2">
                        <FiUser className="text-slate-300" /> {parcel.senderName}
                      </div>
                      <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <FiPhone className="text-slate-300" /> {parcel.senderContact}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">{parcel.deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="bg-emerald-50/30 p-6 rounded-3xl border border-emerald-50">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FiNavigation /> Destination
                    </h4>
                    <div className="space-y-2">
                      <div className="font-black text-slate-800 flex items-center gap-2">
                        <FiUser className="text-emerald-300" /> {parcel.receiverName}
                      </div>
                      <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <FiPhone className="text-emerald-300" /> {parcel.receiverPhoneNumber}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">{parcel.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-50 flex justify-end gap-4">
                {parcel.delivery_status === 'assigned' && (
                  <button
                    onClick={() => pickMutation.mutate(parcel._id)}
                    disabled={pickMutation.isPending}
                    className="btn btn-sm bg-[#1E5AA8] hover:bg-[#2E7D32] text-white border-none rounded-xl px-8 font-black uppercase tracking-widest shadow-lg shadow-[#1E5AA8]/20 h-11"
                  >
                    {pickMutation.isPending ? "Starting Mission..." : "Mark as Picked"}
                  </button>
                )}
                {parcel.delivery_status === 'on_the_way' && (
                  <button
                    onClick={() => { setSelectedParcel(parcel); setIsModalOpen(true); }}
                    className="btn btn-sm bg-[#2E7D32] hover:bg-[#1E5AA8] text-white border-none rounded-xl px-8 font-black uppercase tracking-widest shadow-lg shadow-[#2E7D32]/20 h-11"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Confirmation Modal */}
      {isModalOpen && selectedParcel && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
              <FiCheckCircle />
            </div>
            <h3 className="text-2xl font-black text-slate-800 text-center mb-2">Confirm Delivery?</h3>
            <p className="text-slate-500 font-medium text-center mb-8">
              Are you sure you have successfully delivered the parcel to <span className="text-slate-800 font-black">{selectedParcel.receiverName}</span>?
            </p>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-lg bg-[#2E7D32] hover:bg-[#1E5AA8] text-white border-none rounded-[2rem] font-black uppercase tracking-widest h-16 shadow-xl shadow-[#2E7D32]/20"
                onClick={() => deliverMutation.mutate(selectedParcel._id)}
                disabled={deliverMutation.isPending}
              >
                {deliverMutation.isPending ? "Processing..." : "Yes, Delivered"}
              </button>
              <button
                className="btn btn-lg bg-slate-50 hover:bg-slate-100 text-slate-400 border-none rounded-[2rem] font-black uppercase tracking-widest h-16"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
