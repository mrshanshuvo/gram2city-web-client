import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../../../api/axios";

const Merchant = () => {

  const { data: config, isLoading } = useQuery({
    queryKey: ["landing-config"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/config");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="h-72 bg-slate-100 rounded-3xl" />
      </div>
    );
  }

  const merchant = config?.merchantSection;

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-[#03373D] py-12 px-8 sm:px-12 lg:px-16 shadow-2xl"
      >
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CAEB66]/10 blur-[100px] rounded-full -mr-48 -mt-48" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CAEB66]/10 text-[#CAEB66] text-[10px] font-black uppercase tracking-widest"
            >
              <TrendingUp size={12} />
              Partner With Us
            </motion.div>

            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
              {merchant.title}
            </h2>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {merchant.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {merchant.benefits.map((benefit: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <div className="bg-[#CAEB66]/10 p-1.5 rounded-lg text-[#CAEB66]">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm font-bold">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <button className="flex items-center gap-2 px-8 py-3.5 bg-[#CAEB66] text-[#03373D] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all group">
                {merchant.ctaText}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* Visual Element / Placeholder for Illustration */}
          <div className="lg:w-1/2 w-full relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="/images/features/merchant.png"
                alt="Merchant Partner"
                className="w-full h-120 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03373D]/60 to-transparent" />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#CAEB66]/10 blur-[50px] rounded-full" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Merchant;
