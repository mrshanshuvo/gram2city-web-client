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
  FiAward,
  FiActivity,
  FiStar,
} from "react-icons/fi";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => fetchAdminStats(),
  });

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

  const coreCards = [
    {
      label: "Total Bookings",
      value: data?.parcels?.total || 0,
      icon: <FiPackage />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
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

  const deliveryPipeline = [
    { name: "Pending", value: data?.parcels?.pending || 0, color: "#F59E0B" },
    {
      name: "In Transit",
      value: data?.parcels?.onTheWay || 0,
      color: "#6366F1",
    },
    {
      name: "Delivered",
      value: data?.parcels?.delivered || 0,
      color: "#10B981",
    },
    {
      name: "Returned/Cancelled",
      value: (data?.parcels?.returned || 0) + (data?.parcels?.cancelled || 0),
      color: "#EF4444",
    },
  ];

  const platformStats = [
    {
      label: "Total Customers",
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

      {/* Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {coreCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${card.bg} ${card.color} text-2xl group-hover:scale-110 transition-transform`}
              >
                {card.icon}
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {card.label}
              </span>
            </div>
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Middle Row: Pipeline & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logistics Pipeline Donut */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-800">
                Delivery Pipeline
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Real-time parcel movement breakdown
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl text-xl">
              <FiActivity />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="h-[250px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={deliveryPipeline}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {deliveryPipeline.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {deliveryPipeline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-bold text-gray-600">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-black text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Health Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
            <h3 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tighter">
              Platform Health
            </h3>
            <div className="space-y-8">
              {platformStats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-5">
                  <div
                    className={`p-4 rounded-2xl ${stat.bg} ${stat.color} text-2xl shadow-sm`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <h4 className="text-xl font-black text-gray-800">
                      {stat.value}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-bold">System Status</span>
                <span className="text-emerald-500 font-black">EXCELLENT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Activity Chart */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-gray-800">Booking Activity</h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Last 7 Days
          </span>
        </div>
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
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
                barSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-800 mb-8">
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
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 800 }}
                  width={90}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#8B5CF6"
                  radius={[0, 8, 8, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tighter">
            Fleet Composition
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data?.fleetDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {data?.fleetDistribution?.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"][index % 4]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value, name) => [
                    value,
                    name?.toString().replace("_", " ").toUpperCase(),
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => value.replace("_", " ").toUpperCase()}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tighter">
            Category Breakdown
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data?.parcelTypeDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
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
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl text-2xl">
            <FiAward />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800">Rider Elite</h3>
            <p className="text-sm text-gray-500 font-medium">
              Top performing logistics partners
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-gray-400 uppercase text-[10px] tracking-[0.2em] border-b border-gray-50">
                <th className="bg-transparent py-6">Partner</th>
                <th className="bg-transparent py-6">Performance</th>
                <th className="bg-transparent py-6">Satisfaction</th>
                <th className="bg-transparent py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.riderLeaderboard?.map((rider, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50/50 transition-all group"
                >
                  <td className="py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 group-hover:text-blue-600 transition-colors">
                        {rider.name}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400">
                        {rider.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-800">
                        {rider.deliveredCount}
                      </span>
                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${Math.min(rider.deliveredCount * 10, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-1.5 text-amber-500 font-black">
                      <FiStar className="fill-current" />
                      <span>{rider.rating?.toFixed(1) || "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <span
                      className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                        idx === 0
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      RANK #{idx + 1}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Merchant Applications Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-gray-800">Merchant Hub</h3>
            <p className="text-sm text-gray-500 font-medium">Pending business verifications</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-gray-400 uppercase text-[10px] tracking-[0.2em] border-b border-gray-50">
                <th className="bg-transparent py-6">Business</th>
                <th className="bg-transparent py-6">Contact</th>
                <th className="bg-transparent py-6">Status</th>
                <th className="bg-transparent py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50/50 transition-all">
                <td className="py-6">
                  <div className="flex flex-col">
                    <span className="font-black text-gray-800">Apex Retail</span>
                    <span className="text-[10px] font-bold text-slate-400">Merchant Partner</span>
                  </div>
                </td>
                <td className="py-6 text-sm font-medium text-slate-600">apex@business.com</td>
                <td className="py-6">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full">PENDING</span>
                </td>
                <td className="py-6 text-right">
                  <button className="btn btn-xs bg-[#1E5AA8] hover:bg-[#2E7D32] text-white border-none rounded-lg px-4 font-black">Verify</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
