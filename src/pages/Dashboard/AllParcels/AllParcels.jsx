import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiSearch, FiCalendar, FiFilter, FiChevronLeft, FiChevronRight, FiGrid, FiList } from "react-icons/fi";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";
import moment from "moment";

const AllParcels = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-all-parcels", page, size, status, startDate, endDate],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/all-parcels", {
        params: { page, size, status, startDate, endDate }
      });
      return res.data;
    }
  });

  const parcels = data?.parcels || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / size);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 font-outfit">All Parcels</h2>
          <p className="text-gray-500 font-medium font-outfit">Track and monitor every shipment on the platform.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-50">
          <button className="btn btn-sm btn-ghost btn-square text-primary"><FiList /></button>
          <button className="btn btn-sm btn-ghost btn-square text-gray-300"><FiGrid /></button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="form-control">
          <label className="label text-[10px] font-bold text-gray-400 uppercase tracking-widest px-0">Filter by Status</label>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={status} 
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="select select-bordered w-full pl-10 h-10 min-h-0 bg-gray-50 border-none font-bold text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="assigned">Assigned</option>
              <option value="picked_up">Picked Up</option>
              <option value="on_the_way">On the Way</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="form-control">
          <label className="label text-[10px] font-bold text-gray-400 uppercase tracking-widest px-0">Start Date</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="date" 
              className="input w-full pl-10 h-10 min-h-0 bg-gray-50 border-none font-bold text-xs"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label text-[10px] font-bold text-gray-400 uppercase tracking-widest px-0">End Date</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="date" 
              className="input w-full pl-10 h-10 min-h-0 bg-gray-50 border-none font-bold text-xs"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-end">
          <button 
            onClick={() => { setStartDate(""); setEndDate(""); setStatus("all"); setPage(1); }}
            className="btn btn-ghost w-full h-10 min-h-0 text-xs font-bold text-gray-400"
          >
            Clear All
          </button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader type="table" rows={size} />
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs">
              <thead className="bg-gray-50/50">
                <tr className="border-b border-gray-100">
                  <th className="font-outfit uppercase tracking-wider text-gray-400 font-bold py-5">Customer</th>
                  <th className="font-outfit uppercase tracking-wider text-gray-400 font-bold py-5">Parcel Details</th>
                  <th className="font-outfit uppercase tracking-wider text-gray-400 font-bold py-5">Value</th>
                  <th className="font-outfit uppercase tracking-wider text-gray-400 font-bold py-5">Status</th>
                  <th className="font-outfit uppercase tracking-wider text-gray-400 font-bold py-5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {parcels.map((parcel) => (
                  <tr key={parcel._id} className="hover:bg-gray-50/50 transition-colors">
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-black text-gray-800 text-sm tracking-tight">{parcel.senderName}</span>
                        <span className="text-[10px] text-gray-400">{parcel.senderPhone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-primary font-bold">#{parcel.trackingId}</span>
                        <span className="text-gray-500 font-medium">{parcel.parcelType}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-700">৳{parcel.cost}</span>
                        <span className="text-[10px] text-gray-400">{parcel.weight}kg</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-sm border-none font-bold uppercase text-[9px] tracking-widest px-3 py-2 ${
                        parcel.delivery_status === 'delivered' ? 'bg-green-100 text-green-700' :
                        parcel.delivery_status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        parcel.delivery_status === 'picked_up' ? 'bg-purple-100 text-purple-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {parcel.delivery_status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="text-gray-400 font-medium">
                        {moment(parcel.creation_date).format("MMM D, YYYY")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing Page {page} of {totalPages || 1} ({total} Total Results)
            </span>
            <div className="join">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="join-item btn btn-sm bg-gray-50 border-none text-gray-500 hover:bg-primary hover:text-white"
              >
                <FiChevronLeft />
              </button>
              {[...Array(totalPages || 0)].map((_, i) => (
                <button
                  key={i}
                  disabled={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`join-item btn btn-sm border-none ${page === i + 1 ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="join-item btn btn-sm bg-gray-50 border-none text-gray-500 hover:bg-primary hover:text-white"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllParcels;
