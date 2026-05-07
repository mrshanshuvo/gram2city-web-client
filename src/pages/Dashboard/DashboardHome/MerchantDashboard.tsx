import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  FiPackage,
  FiDollarSign,
  FiTruck,
  FiActivity,
  FiPlus,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { useAuthStore } from "../../../features/auth/authStore";
import { fetchUserStats } from "../../../features/users/api"; // We'll need a merchant specific one soon
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const MerchantDashboard = () => {
  const { user } = useAuthStore();

  // For now using user stats, but in a real app we'd have a merchant-specific API
  const { data: stats, isLoading } = useQuery({
    queryKey: ["merchant-stats", user?.email],
    queryFn: () => {
      if (!user?.email) return null;
      return fetchUserStats(user.email);
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </div>
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Volume",
      value: stats?.totalBooked || 0,
      icon: <FiPackage />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "COD Pending",
      value: `৳${stats?.totalSpent || 0}`, // Placeholder logic
      icon: <FiClock />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Paid to Me",
      value: "৳0",
      icon: <FiDollarSign />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const pipelineData = [
    { name: "Order Placed", value: 12, color: "#F59E0B" },
    { name: "In Transit", value: 8, color: "#6366F1" },
    { name: "Delivered", value: 45, color: "#10B981" },
    { name: "Returns", value: 3, color: "#EF4444" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Merchant Hub</h2>
          <p className="text-slate-500 font-medium text-sm">
            Manage your business shipments and receivables
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/addParcel"
            className="btn bg-[#2E7D32] hover:bg-[#1E5AA8] text-white border-none rounded-2xl font-black px-6 shadow-xl shadow-[#2E7D32]/20 flex items-center gap-2"
          >
            <FiPlus /> Create Shipment
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color} text-2xl group-hover:scale-110 transition-transform`}
              >
                {kpi.icon}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {kpi.label}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logistics Distribution */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <FiActivity className="text-blue-500" /> Shipment Lifecycle
            </h3>
            <span className="text-xs font-bold text-slate-400">Real-time update</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {pipelineData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-bold text-slate-600">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips / Announcements */}
        <div className="bg-gradient-to-br from-[#1E5AA8] to-[#2E7D32] p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <FiTruck className="text-4xl mb-6 text-white/50" />
          <h3 className="text-xl font-black mb-4">Grow Your Business</h3>
          <p className="text-white/80 text-sm font-medium leading-relaxed mb-6">
            Did you know? Merchants using our **Large Pickup** service see 40%
            faster heavy-goods delivery.
          </p>
          <button className="btn btn-sm bg-white border-none text-[#1E5AA8] font-black rounded-xl px-6 h-10 hover:bg-slate-100">
            Learn More
          </button>
        </div>
      </div>

      {/* Success Banner */}
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-white rounded-2xl text-emerald-600 text-3xl shadow-sm">
          <FiCheckCircle />
        </div>
        <div>
          <h4 className="text-lg font-black text-emerald-900">
            Business Profile Verified
          </h4>
          <p className="text-emerald-700/70 text-sm font-medium">
            Your trade license has been successfully verified. You now have
            access to priority pickup and lower commissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
