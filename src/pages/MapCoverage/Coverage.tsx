import { useState } from "react";
import CoverageMap from "./CoverageMap";
import { FiSearch, FiMapPin, FiTruck, FiGlobe } from "react-icons/fi";
import { ServiceCenter } from "../../features/riders/types";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchStats, fetchWarehouses } from "../../features/landing/api";
import { queryKeys } from "../../lib/queryKeys";
import Skeleton from "../../components/ui/Skeleton";

const Coverage = () => {
  const { data: serviceCenters = [] } = useQuery<ServiceCenter[]>({
    queryKey: queryKeys.landing.warehouses(),
    queryFn: fetchWarehouses,
  });

  const { data: stats } = useQuery({
    queryKey: queryKeys.landing.stats(),
    queryFn: fetchStats,
  });
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [targetCoords, setTargetCoords] = useState<[number, number] | null>(
    null,
  );

  // ─── Filter Logic ──────────────────────────────────────────────────────────
  const filteredCenters = serviceCenters.filter((center: ServiceCenter) => {
    const matchesSearch =
      center.district.toLowerCase().includes(searchInput.toLowerCase()) ||
      center.city.toLowerCase().includes(searchInput.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || center.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSearch = () => {
    if (filteredCenters.length > 0) {
      setTargetCoords([
        filteredCenters[0].latitude,
        filteredCenters[0].longitude,
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Premium Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#2E7D32]/30 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#1E5AA8]/30 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
              Real-time Network Status
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight"
          >
            Connecting Every <br />
            <span className="text-[#F4C20D]">Gram to Every City</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-8"
          >
            Explore our rapidly expanding logistics network. We are bridging the
            gap with high-speed hubs and digital tracking in 64 districts.
          </motion.p>

          {/* Status Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              { id: "all", label: "National Network" },
              { id: "active", label: "Full Operations" },
              { id: "limited", label: "Express Zones" },
              { id: "coming-soon", label: "Upcoming" },
            ].map((status) => (
              <button
                key={status.id}
                onClick={() => setStatusFilter(status.id)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                  statusFilter === status.id
                    ? "bg-white text-slate-900 border-white shadow-xl shadow-white/10 scale-105"
                    : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
                }`}
              >
                {status.label}
              </button>
            ))}
          </motion.div>

          {/* ─── Statistical Counters ────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <FiMapPin className="text-[#F4C20D]" />,
                label: "Hubs Active",
                value: stats?.activeHubs,
              },
              {
                icon: <FiGlobe className="text-[#F4C20D]" />,
                label: "Districts",
                value: stats?.districts,
              },
              {
                icon: <FiTruck className="text-[#F4C20D]" />,
                label: "Express Zones",
                value: stats?.expressZones,
              },
              {
                icon: <FiMapPin className="text-[#F4C20D]" />,
                label: "Riders",
                value: stats?.riders,
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center"
              >
                <div className="flex justify-center mb-2 text-2xl">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-white min-h-[36px] flex items-center justify-center">
                  {stat.value !== undefined ? (
                    stat.value
                  ) : (
                    <Skeleton className="h-8 w-16 bg-white/10" />
                  )}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Search & Map Section ───────────────────────────────────────── */}
      <section className="relative -mt-16 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Glassmorphic Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto mb-16 p-2 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200 border border-slate-100 flex items-center gap-2 group"
          >
            <div className="flex-1 relative">
              <FiSearch
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search your district (e.g. Dhaka, Bogura...)"
                className="w-full pl-16 pr-6 py-5 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-10 py-5 bg-[#2E7D32] text-white font-black rounded-full hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-[#2E7D32]/20"
            >
              Locate Hub
            </button>
          </motion.div>

          {/* Map Container */}
          <div className="space-y-8">
            <div className="flex items-end justify-between px-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Network Visualization
                </h2>
                <p className="text-slate-500 font-medium italic">
                  Interactive map of our current and upcoming logistics hubs.
                </p>
              </div>
              <div className="hidden md:flex gap-4">
                <div className="px-4 py-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">
                    Last Updated: Today, 10:00 AM
                  </span>
                </div>
              </div>
            </div>

            <CoverageMap
              serviceCenters={filteredCenters}
              targetCoords={targetCoords}
            />
          </div>
        </div>
      </section>

      {/* ─── Tier Explanation Section ──────────────────────────────────── */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
              <FiMapPin size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Active Hubs</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Full logistics infrastructure including same-day pickup, real-time
              tracking, and local sorting centers.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <FiTruck size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Express Points
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Dedicated pickup points for faster merchant drop-offs. Full city
              sorting centers coming soon.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <FiGlobe size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Next Frontier</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Areas currently in our survey phase. We are recruiting local
              riders and finalizing sorting facilities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Coverage;
