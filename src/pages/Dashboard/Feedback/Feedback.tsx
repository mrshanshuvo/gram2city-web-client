import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { FiStar, FiMessageCircle, FiCheckCircle, FiHeart } from "react-icons/fi";
import Swal from "sweetalert2";

const Feedback = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState<string>("service");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await axiosSecure.post("/feedback", {
        userName: user?.displayName,
        rating,
        comment,
        category
      });
      
      Swal.fire({
        title: "Thank You!",
        text: "Your feedback helps us make Gram2City better for everyone.",
        icon: "success",
        confirmButtonColor: "#CAEB66"
      });
      
      setComment("");
      setRating(5);
    } catch (error) {
      Swal.fire("Error", "Failed to submit feedback. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 font-outfit">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
          <FiHeart className="text-4xl animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">How are we doing?</h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Your feedback fuels our progress</p>
      </div>

      {/* Feedback Card */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          {/* Rating Section */}
          <div className="space-y-4 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Satisfaction</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all duration-300 hover:scale-125 active:scale-95"
                >
                  <FiStar
                    className={`text-4xl ${
                      (hover || rating) >= star ? "text-amber-400 fill-amber-400" : "text-gray-200"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-gray-500">
              {rating === 5 ? "Incredible experience!" : rating === 4 ? "Great job, small tweaks needed." : rating === 3 ? "It's okay, could be better." : "We're sorry to hear that."}
            </p>
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Primary Focus</p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["service", "app", "rider", "other"].map((cat) => (
                   <button
                     key={cat}
                     type="button"
                     onClick={() => setCategory(cat)}
                     className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       category === cat 
                         ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20" 
                         : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                     }`}
                   >
                     {cat}
                   </button>
                ))}
             </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detailed Insights</p>
               <span className="text-[10px] font-bold text-gray-300">{comment.length} / 500</span>
            </div>
            <textarea
              required
              maxLength={500}
              placeholder="What can we improve? Share your thoughts with our engineering team..."
              className="w-full h-40 bg-gray-50 border-none rounded-[2rem] p-8 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-gray-900 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <FiCheckCircle className="text-xl" /> Transmit Feedback
              </>
            )}
          </button>
        </form>
      </div>

      {/* Proof of Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
         <div className="p-6 bg-gray-50 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary">
               <FiMessageCircle className="text-xl" />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">24/7 Monitoring</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">Reviewed by our management team</p>
            </div>
         </div>
         <div className="p-6 bg-gray-50 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary">
               <FiCheckCircle className="text-xl" />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Closed-Loop System</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">We act on every verified suggestion</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Feedback;
