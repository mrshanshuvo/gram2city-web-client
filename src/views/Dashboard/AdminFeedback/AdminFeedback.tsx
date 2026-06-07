import { useQuery } from "@tanstack/react-query";
import { fetchFeedback } from "../../../features/admin/api";
import { Feedback } from "../../../features/admin/types";
import {
  FiStar,
  FiMessageSquare,
  FiUser,
  FiClock,
  FiFilter,
  FiCheckCircle,
} from "react-icons/fi";
import moment from "moment";

const AdminFeedback = () => {
  const { data: feedback = [], isLoading } = useQuery<Feedback[]>({
    queryKey: ["adminFeedback"],
    queryFn: () => fetchFeedback(),
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 font-outfit">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            System Feedback
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Analyzing Community Sentiment
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-sm bg-white border-gray-100 text-gray-400 hover:bg-gray-50 rounded-xl font-bold uppercase text-[9px] tracking-widest">
            <FiFilter className="mr-2" /> All Categories
          </button>
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {feedback.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/40 transition-all group relative overflow-hidden"
          >
            {/* Category Badge */}
            <div className="absolute top-6 right-8">
              <span className="badge badge-sm border-none bg-gray-50 text-gray-400 font-black uppercase text-[8px] tracking-widest py-3 px-4">
                {item.category}
              </span>
            </div>

            <div className="flex flex-col h-full space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center shrink-0">
                  <FiUser className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-black text-gray-800 text-sm">
                    {item.userName || "Anonymous"}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 font-mono tracking-tighter">
                    {item.userEmail}
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FiStar
                    key={s}
                    className={`text-sm ${item.rating >= s ? "text-amber-400 fill-amber-400" : "text-gray-100"}`}
                  />
                ))}
              </div>

              <p className="text-sm font-medium text-gray-600 leading-relaxed italic flex-1">
                "{item.comment}"
              </p>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  <FiClock /> {moment(item.timestamp).fromNow()}
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                  <FiCheckCircle /> Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {feedback.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <FiMessageSquare className="text-6xl text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-gray-300 uppercase tracking-widest">
            No Feedback Yet
          </h3>
          <p className="text-sm font-bold text-gray-200 mt-2">
            Feedback from users will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
