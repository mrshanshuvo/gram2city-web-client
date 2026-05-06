import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../features/auth/authStore";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiPackage, FiDollarSign, FiStar, FiClock, FiMessageSquare } from "react-icons/fi";
import moment from "moment";

const RiderDashboard = () => {
  const { user } = useAuthStore();
  const axiosSecure = useAxiosSecure();

  // Fetch Rider Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["rider-stats", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/rider/stats/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch Rider Reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["rider-reviews", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/reviews/rider/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (statsLoading || reviewsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Delivered", 
      value: stats?.totalDelivered || 0, 
      icon: <FiPackage />, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Total Earnings", 
      value: `৳${stats?.totalEarnings?.toFixed(2) || 0}`, 
      icon: <FiDollarSign />, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
    { 
      label: "Avg Rating", 
      value: `${stats?.avgRating?.toFixed(1) || 0} / 5`, 
      icon: <FiStar />, 
      color: "text-yellow-600", 
      bg: "bg-yellow-50" 
    },
    { 
      label: "New Reviews", 
      value: reviews.length, 
      icon: <FiMessageSquare />, 
      color: "text-amber-600", 
      bg: "bg-amber-50" 
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Rider Dashboard</h2>
          <p className="text-gray-500 font-medium">Tracking your effort and impact as a Gram2City Hero</p>
        </div>
        <div className="badge badge-lg bg-green-100 text-green-700 p-4 border-none gap-2 font-bold shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Online & Ready
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color} text-2xl`}>
                {card.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.label}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reviews List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiMessageSquare className="text-amber-500" /> Recent Feedback
            </h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          
          <div className="divide-y divide-gray-50">
            {reviews.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <FiStar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No reviews received yet. Your hard work will be rewarded soon!</p>
              </div>
            ) : (
              reviews.map((review: any) => (
                <div key={review._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                        {review.user_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{review.user_name || "Anonymous User"}</h4>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock /> {moment(review.date).fromNow()}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 text-sm">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FiStar key={s} fill={s <= review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic bg-gray-50 p-4 rounded-xl border-l-4 border-amber-300">
                    "{review.comment || "Great delivery service, very punctual!"}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tips / Goals Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
            <h3 className="text-xl font-bold mb-4">Earn More!</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Complete deliveries within same district to earn <span className="text-white font-bold">৳80%</span> of the parcel cost.
            </p>
            <button className="btn btn-sm bg-white border-none text-primary font-bold px-6 hover:bg-gray-100 h-10 rounded-full">
              Read Guidelines
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4">Milestones</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Deliveries (12/20)</span>
                  <span>60%</span>
                </div>
                <progress className="progress progress-primary w-full h-2" value="60" max="100"></progress>
              </div>
              <p className="text-[10px] text-gray-400">Complete 8 more deliveries to unlock the "Express Hero" badge!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;