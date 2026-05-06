import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { FiTarget } from "react-icons/fi";

const TrackerBar = () => {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/dashboard/trackParcel`, {
        state: { trackingId: trackingId.trim() },
      });
    }
  };

  return (
    <div className="relative z-40 max-w-7xl mx-auto px-6 -mt-12 md:-mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-2 md:p-3"
      >
        <form
          onSubmit={handleTrack}
          className="flex flex-col md:flex-row items-center gap-4 md:gap-2"
        >
          {/* Left: Text Label */}
          <div className="flex-1 px-4 md:px-6 py-2">
            <p className="text-slate-500 font-medium text-sm md:text-base whitespace-nowrap">
              Track your parcel to get detailed update
            </p>
          </div>

          {/* Middle: Input Group */}
          <div className="flex-[1.5] w-full relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <FiTarget size={20} />
            </div>
            <input
              type="text"
              placeholder="Enter Tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/50 transition-all font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Right: Action Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-10 py-4 bg-white border-2 border-brand-red text-brand-red font-black rounded-xl hover:bg-brand-red hover:text-white transition-all duration-300 uppercase tracking-widest text-xs whitespace-nowrap"
          >
            Track parcel
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default TrackerBar;
