'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiTarget } from 'react-icons/fi';

const TrackerBar = () => {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/dashboard/trackParcel?id=${encodeURIComponent(trackingId.trim())}`);
    }
  };

  return (
    <div className="relative z-40 max-w-350 mx-auto px-6 -mt-12 md:-mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-2 md:p-3 transition-colors"
      >
        <form
          onSubmit={handleTrack}
          className="flex flex-col md:flex-row items-center gap-4 md:gap-2"
        >
          {/* Left: Text Label */}
          <div className="flex-1 px-4 md:px-6 py-2">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base whitespace-nowrap">
              Track your parcel to get detailed update
            </p>
          </div>

          {/* Middle: Input Group */}
          <div className="flex-[1.5] w-full relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <FiTarget size={20} />
            </div>
            <input
              type="text"
              placeholder="Enter Tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/50 transition-all font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Right: Action Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-10 py-4 bg-white dark:bg-slate-900 border-2 border-brand-red text-brand-red font-black rounded-xl hover:bg-brand-red hover:text-white transition-all duration-300 uppercase tracking-widest text-xs whitespace-nowrap cursor-pointer"
          >
            Track parcel
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default TrackerBar;
