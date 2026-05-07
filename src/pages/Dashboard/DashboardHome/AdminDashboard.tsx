import { useQuery } from "@tanstack/react-query";

import { fetchAdminStats } from "../../../features/admin/api";
import { AdminStats } from "../../../features/admin/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FiTrendingUp,
  FiPackage,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiStar,
  FiAward,
} from "react-icons/fi";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const AdminDashboard = () => {


  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => fetchAdminStats(),
  });

  console.log(stats);

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-center mb-4">
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkeletonLoader type="chart" />
          </div>
          <SkeletonLoader type="chart" />
        </div>
      </div>
    );
  }

  const data = stats?.stats;

  const statCards = [
    {
      label: "Total Revenue",
      value: `৳${data?.revenue?.toLocaleString() || 0}`,
      icon: <FiDollarSign />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Profit",
      value: `৳${data?.profit?.toLocaleString() || 0}`,
      icon: <FiTrendingUp />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Pending Parcels",
      value: data?.parcels?.pending || 0,
      icon: <FiPackage />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Delivered",
      value: data?.parcels?.delivered || 0,
      icon: <FiPackage />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Customers",
      value: data?.users?.customers || 0,
      icon: <FiUsers />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active Riders",
      value: data?.users?.riders || 0,
      icon: <FiUsers />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Avg Delivery",
      value: `${data?.avgDeliveryTime?.toFixed(1) || 0}h`,
      icon: <FiClock />,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Success Rate",
      value: `${
        data?.parcels?.delivered && data?.parcels?.total
          ? ((data.parcels.delivered / data.parcels.total) * 100).toFixed(1)
          : 0
      }%`,
      icon: <FiTrendingUp />,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Operational
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-sm btn-ghost bg-white border border-gray-100 hover:bg-gray-50 rounded-xl px-4 font-bold text-gray-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${card.bg} ${card.color} text-2xl`}
              >
                {card.icon}
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Daily Bookings Chart - Full Width */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Booking Activity (Last 7 Days)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={data?.dailyBookings || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Distribution Charts - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Parcel Type Distribution */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Parcel Categories
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data?.parcelTypeDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="_id"
                  >
                    {data?.parcelTypeDistribution?.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Regional Demand
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart
                  layout="vertical"
                  data={data?.districtDistribution || []}
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="_id"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#8B5CF6"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Rider Leaderboard */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl text-xl">
            <FiAward />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Top Performance Riders
            </h3>
            <p className="text-sm text-gray-500">
              Recognition for highest delivery success
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">
                <th className="bg-transparent py-4">Rider</th>
                <th className="bg-transparent py-4">Deliveries</th>
                <th className="bg-transparent py-4">Rating</th>
                <th className="bg-transparent py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.riderLeaderboard?.map((rider, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">
                        {rider.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {rider.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="badge badge-ghost font-black text-primary border-none bg-blue-50 px-3">
                      {rider.deliveredCount}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <FiStar className="fill-current" />
                      <span>{rider.rating?.toFixed(1) || "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter bg-emerald-50 px-2 py-1 rounded">
                      Top {idx + 1}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.riderLeaderboard ||
                data.riderLeaderboard.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-gray-400 italic"
                  >
                    No delivery data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
