import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiSearch, FiPackage, FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";
import moment from "moment";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";

const TrackParcel = () => {
  const [searchId, setSearchId] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const axiosSecure = useAxiosSecure();

  const { data: trackings = [], isLoading, isError } = useQuery({
    queryKey: ["tracking", trackingId],
    queryFn: async () => {
      if (!trackingId) return [];
      const res = await axiosSecure.get(`/trackings/${trackingId}`);
      return res.data;
    },
    enabled: !!trackingId,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setTrackingId(searchId);
  };

  const stepsCount = 6;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-gray-800 tracking-tight font-outfit">Track Your Shipment</h2>
        <p className="text-gray-500 max-w-lg mx-auto">Enter your tracking number to see the real-time status of your parcel.</p>
        
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-primary/10 border border-gray-100">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ex: G2C-123456"
              className="input w-full border-none focus:ring-0 pl-11 h-12 bg-transparent font-mono font-bold text-primary"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary h-12 px-8 rounded-xl">Track</button>
        </form>
      </div>

      {!trackingId && !isLoading && (
        <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch className="text-3xl text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium font-outfit">Ready to find your package?</p>
        </div>
      )}

      {isLoading && <SkeletonLoader type="table" rows={6} />}

      {trackingId && !isLoading && trackings.length === 0 && !isError && (
        <div className="alert alert-error font-bold rounded-2xl shadow-lg border-none text-white bg-red-500">
          No tracking history found for ID: {trackingId}. Please check the number and try again.
        </div>
      )}

      {trackings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Vertical Timeline */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              <FiTrendingUp className="text-primary" /> Delivery Journey
            </h3>
            
            <div className="space-y-0">
              {trackings.map((update, idx) => (
                <div key={update._id} className="relative flex gap-6 pb-10 group last:pb-0">
                  {/* Line */}
                  {idx !== trackings.length - 1 && (
                    <div className="absolute left-6 top-10 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-gray-100 -translate-x-1/2"></div>
                  )}
                  
                  {/* Icon Node */}
                  <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    idx === 0 ? "bg-primary text-white scale-110 ring-4 ring-primary/20" : "bg-gray-100 text-gray-400"
                  }`}>
                    <FiCheckCircle className="text-xl" />
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 pt-1 ${idx === 0 ? "opacity-100" : "opacity-60"}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-lg uppercase tracking-wider text-gray-800">
                        {update.status?.replace("_", " ")}
                      </h4>
                      <span className="text-[10px] font-bold bg-gray-50 px-2 py-1 rounded text-gray-500">
                        {moment(update.time).format("HH:mm A")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed italic">
                      "{update.details}"
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-primary uppercase">
                      <FiMapPin className="text-xs" /> {update.location || "Central Hub"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-primary p-8 rounded-3xl text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
              <FiPackage className="absolute -right-4 -bottom-4 text-8xl opacity-10" />
              <h4 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-2">Tracking ID</h4>
              <p className="text-2xl font-black font-mono mb-6">{trackingId}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm py-3 border-b border-white/10">
                  <span className="opacity-60">Estimated Time</span>
                  <span className="font-bold">2-3 Business Days</span>
                </div>
                <div className="flex justify-between text-sm py-3 border-b border-white/10">
                  <span className="opacity-60">Last Update</span>
                  <span className="font-bold">{moment(trackings[0]?.time).fromNow()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4 tracking-tight uppercase text-xs">Journey Progress</h4>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${(trackings.length / stepsCount) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center font-bold">
                {Math.round((trackings.length / stepsCount) * 100)}% Journey Completed
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal icon for "On the Way" as it was missing from imports
const FiTrendingUp = ({ className }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default TrackParcel;