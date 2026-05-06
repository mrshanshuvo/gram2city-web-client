import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import location from "../../../assets/location-merchant.png";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

const Merchant = () => {
  const axiosPublic = useAxios();

  const { data: config, isLoading } = useQuery({
    queryKey: ["landing-config"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/config");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-96 bg-[#03373D] rounded-[3rem]" />
      </div>
    );
  }

  const merchant = config?.merchantSection || {
    title: "Merchant and Customer Satisfaction is Our First Priority",
    description:
      "We offer the most competitive delivery rates with unparalleled value. Gram2City ensures your parcels reach every corner of the nation with 100% safety and precision.",
    benefits: [
      "Nationwide Coverage",
      "Fastest Settlement",
      "Cash on Delivery",
      "Real-time Dashboard",
    ],
    ctaText: "Become a Merchant",
    ctaLink: "/register",
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[3rem] bg-[#03373D] py-20 px-8 sm:px-16 lg:px-24"
      >
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#CAEB66]/5 blur-[120px] rounded-full -mr-64 -mt-64" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="lg:w-3/5 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CAEB66]/10 text-[#CAEB66] text-xs font-black uppercase tracking-widest"
            >
              <TrendingUp size={14} />
              Partner With Us
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              {merchant.title}
            </h2>

            <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-2xl">
              {merchant.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              {merchant.benefits?.map((item: string) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-slate-200 font-bold"
                >
                  <CheckCircle2 className="text-[#CAEB66]" size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="group px-8 py-5 bg-[#CAEB66] text-slate-900 font-black rounded-2xl shadow-xl shadow-[#CAEB66]/10 hover:shadow-[#CAEB66]/20 transition-all flex items-center justify-center gap-3">
                {merchant.ctaText}
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <button className="px-8 py-5 border-2 border-[#CAEB66]/20 text-[#CAEB66] font-black rounded-2xl hover:bg-[#CAEB66]/5 transition-all">
                Earn with Gram2City
              </button>
            </div>
          </div>

          {/* Image Side */}
          <div className="lg:w-2/5">
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <img
                src={location}
                alt="Merchant tracking"
                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(202,235,102,0.15)]"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Merchant;
