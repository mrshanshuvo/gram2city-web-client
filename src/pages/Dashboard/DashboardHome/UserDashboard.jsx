import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useOutletContext, Link } from "react-router";
import { FiPackage, FiDollarSign, FiClock, FiPlus, FiSearch, FiTrendingUp } from "react-icons/fi";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";
import moment from "moment";

const UserDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { parcelsData } = useOutletContext();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/stats/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (statsLoading) {
    return (
      <div className="space-y-8">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="table" rows={3} />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Booked",
      value: stats?.totalBooked || 0,
      icon: <FiPackage />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Unpaid Parcels",
      value: stats?.unpaidCount || 0,
      icon: <FiClock />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Spent",
      value: `৳${stats?.totalSpent || 0}`,
      icon: <FiDollarSign />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">User Dashboard</h2>
          <p className="text-gray-500 font-medium font-outfit">Overview of your delivery activity</p>
        </div>
        <div className="flex gap-2">
          <Link to="/addParcel" className="btn btn-primary shadow-lg shadow-primary/20 gap-2">
            <FiPlus /> New Parcel
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color} text-2xl group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.label}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiTrendingUp className="text-primary" /> Recent Bookings
            </h3>
            <Link to="/dashboard/myParcels" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-[10px] uppercase tracking-wider text-gray-400">Tracking ID</th>
                  <th className="text-[10px] uppercase tracking-wider text-gray-400">Parcel Name</th>
                  <th className="text-[10px] uppercase tracking-wider text-gray-400">Status</th>
                  <th className="text-[10px] uppercase tracking-wider text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {parcelsData?.slice(0, 5).map((parcel) => (
                  <tr key={parcel._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="font-mono text-xs font-bold text-primary">{parcel.trackingId}</td>
                    <td className="text-sm font-medium text-gray-700">{parcel.parcelName}</td>
                    <td>
                      <span className={`badge badge-sm border-none font-bold ${
                        parcel.delivery_status === 'delivered' ? 'bg-green-100 text-green-700' :
                        parcel.delivery_status === 'on_the_way' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {parcel.delivery_status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400">{moment(parcel.creation_date).format("MMM D, YYYY")}</td>
                  </tr>
                ))}
                {parcelsData?.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400 italic">No bookings yet. Start shipping today!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links / Help */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <h3 className="text-xl font-bold mb-4">Track Instantly</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Have a tracking number? Check your parcel's real-time location.
            </p>
            <Link to="/dashboard/trackParcel" className="btn btn-sm bg-white border-none text-primary font-bold px-6 hover:bg-gray-100 h-10 rounded-full">
              Open Tracker
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiSearch className="text-primary" /> Need Help?
            </h4>
            <div className="space-y-3">
              <Link to="/coverage" className="block text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all">Check Service Area</Link>
              <a href="#" className="block text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all">Shipping Guidelines</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;