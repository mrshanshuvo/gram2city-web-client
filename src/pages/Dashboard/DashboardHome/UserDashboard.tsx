import { useOutletContext, Link } from "react-router";
import {
  FiPackage,
  FiDollarSign,
  FiClock,
  FiPlus,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";
import moment from "moment";
import ProfileCompletionTracker from "../../../components/Dashboard/ProfileCompletionTracker";
import { Parcel } from "../../../features/parcels/types";
import { useAuthStore } from "../../../features/auth/authStore";
import { useQuery } from "@tanstack/react-query";
import { fetchUserByEmail, fetchUserStats } from "../../../features/users/api";

interface DashboardContext {
  parcelsData?: Parcel[] | { data: Parcel[] };
}

const UserDashboard = () => {
  const { user } = useAuthStore();

  const context = useOutletContext<DashboardContext>();

  const rawParcels = context?.parcelsData;
  const parcelsData: Parcel[] = Array.isArray(rawParcels)
    ? rawParcels
    : rawParcels && "data" in rawParcels && Array.isArray(rawParcels.data)
      ? rawParcels.data
      : [];

  const { data: dbUser, isLoading: userLoading } = useQuery({
    queryKey: ["db-user", user?.email],
    queryFn: () => {
      if (!user?.email) return null;
      return fetchUserByEmail(user.email);
    },
    enabled: !!user?.email,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats", user?.email],
    queryFn: () => {
      if (!user?.email) return null;
      return fetchUserStats(user.email);
    },
    enabled: !!user?.email,
  });

  if (statsLoading || userLoading) {
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
      color: "text-[#2E7D32]",
      bg: "bg-[#2E7D32]/10",
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
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-end pt-2">
        <Link
          to="/addParcel"
          className="btn bg-[#2E7D32] hover:bg-[#1E5AA8] text-white border-none rounded-2xl font-black px-6 shadow-xl shadow-[#2E7D32]/20 flex items-center gap-2"
        >
          <FiPlus /> New Parcel
        </Link>
      </div>

      {/* Profile Completion Tracker */}
      <ProfileCompletionTracker user={dbUser} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-2xl ${card.bg} ${card.color} text-2xl group-hover:scale-110 transition-transform`}
              >
                {card.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {card.label}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FiTrendingUp className="text-[#2E7D32]" /> Recent Bookings
            </h3>
            <Link
              to="/dashboard/myParcels"
              className="text-sm font-bold text-[#2E7D32] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    Tracking ID
                  </th>
                  <th className="text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    Parcel Name
                  </th>
                  <th className="text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    Status
                  </th>
                  <th className="text-[10px] uppercase tracking-wider text-slate-400 font-black text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {parcelsData.slice(0, 5).map((parcel: Parcel) => (
                  <tr
                    key={parcel._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="font-mono text-xs font-bold text-[#2E7D32]">
                      {parcel.trackingId}
                    </td>
                    <td className="text-sm font-bold text-slate-700">
                      {parcel.parcelName}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm border-none font-black text-[10px] uppercase py-3 ${
                          parcel.delivery_status === "delivered"
                            ? "bg-[#2E7D32]/10 text-[#2E7D32]"
                            : parcel.delivery_status === "on_the_way"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {parcel.delivery_status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-xs text-slate-400 font-bold text-right">
                      {moment(parcel.creation_date).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
                {parcelsData.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-slate-400 italic font-medium"
                    >
                      No bookings yet. Start shipping today!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links / Help */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#2E7D32] to-[#1E5AA8] rounded-[2rem] p-8 text-white shadow-xl shadow-[#2E7D32]/20 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <h3 className="text-xl font-black mb-4">Track Instantly</h3>
            <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed">
              Have a tracking number? Check your parcel's real-time location.
            </p>
            <Link
              to="/dashboard/trackParcel"
              className="btn btn-sm bg-white border-none text-[#2E7D32] font-black px-6 hover:bg-slate-50 h-10 rounded-2xl"
            >
              Open Tracker
            </Link>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
              <FiSearch className="text-[#2E7D32]" /> Need Help?
            </h4>
            <div className="space-y-3">
              <Link
                to="/coverage"
                className="block text-sm text-slate-600 font-bold hover:text-[#2E7D32] hover:translate-x-1 transition-all"
              >
                Check Service Area
              </Link>
              <a
                href="#"
                className="block text-sm text-slate-600 font-bold hover:text-[#2E7D32] hover:translate-x-1 transition-all"
              >
                Shipping Guidelines
              </a>
              <a
                href="#"
                className="block text-sm text-slate-600 font-bold hover:text-[#2E7D32] hover:translate-x-1 transition-all"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
