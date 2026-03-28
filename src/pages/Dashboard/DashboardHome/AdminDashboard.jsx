import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FiTrendingUp, FiPackage, FiDollarSign, FiUsers } from "react-icons/fi";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    }
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

  const statCards = [
    {
      label: "Total Revenue",
      value: `৳${stats?.totalRevenue?.toFixed(2) || 0}`,
      icon: <FiDollarSign />,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      label: "Parcel Bookings",
      value: stats?.dailyBookings?.reduce((acc, curr) => acc + curr.count, 0) || 0,
      icon: <FiPackage />,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Recent Activity",
      value: "+12.5%",
      icon: <FiTrendingUp />,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      label: "Total Service Users",
      value: "1.2k",
      icon: <FiUsers />,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">System Analytics</h2>
          <p className="text-gray-500">Real-time overview of Gram2City operations</p>
        </div>
        <div className="badge badge-primary p-4 gap-2 font-bold shadow-sm">
          <FiTrendingUp /> Live Statistics
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color} text-2xl`}>
                {card.icon}
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Bookings Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Activity (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={stats?.dailyBookings || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parcel Type Distribution */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Parcel Categories</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats?.parcelTypeDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {stats?.parcelTypeDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
