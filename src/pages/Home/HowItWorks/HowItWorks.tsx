import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CircleDollarSign,
  Truck,
  Building2,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  PackagePlus,
  CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

const iconMap: Record<string, React.ReactNode> = {
  Calendar: <Calendar className="text-[#2E7D32]" size={32} />,
  CircleDollarSign: <CircleDollarSign className="text-[#F4C20D]" size={32} />,
  Truck: <Truck className="text-[#1E5AA8]" size={32} />,
  Building2: <Building2 className="text-[#2E7D32]" size={32} />,
  PackagePlus: <PackagePlus className="text-[#2E7D32]" size={32} />,
  CheckCircle: <CheckCircle className="text-[#2E7D32]" size={32} />,
};

interface ProcessStep {
  _id: string;
  title: string;
  description: string;
  icon: string;
  steps: string[];
}

const HowItWorks = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const axiosPublic = useAxios();

  const { data: steps = [], isLoading: stepsLoading } = useQuery<ProcessStep[]>({
    queryKey: ["process-steps"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/process-steps");
      return res.data.data;
    },
  });

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["landing-config"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/config");
      return res.data.data;
    },
  });

  const toggleFeature = (id: string) => {
    setActiveFeature(activeFeature === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (stepsLoading || configLoading) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto animate-pulse">
        <div className="w-64 h-10 bg-slate-100 rounded-full mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] text-sm font-bold uppercase tracking-wider"
          >
            How it works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight"
          >
            {config?.howItWorksHeader?.title || "Seamless Logistics from Start to Finish"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto font-medium"
          >
            {config?.howItWorksHeader?.subtitle || "We've simplified the shipping process so you can focus on what matters most."}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((feature, index) => (
            <motion.div
              key={feature._id}
              variants={itemVariants}
              onClick={() => toggleFeature(feature._id)}
              className={`group relative p-8 rounded-[2rem] bg-white border border-slate-100 transition-all duration-500 cursor-pointer overflow-hidden ${
                activeFeature === feature._id
                  ? "ring-2 ring-[#1E5AA8] shadow-2xl scale-[1.02]"
                  : "hover:shadow-xl hover:border-slate-200"
              }`}
            >
              {/* Decorative Background Glow */}
              <div
                className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                  index % 3 === 0
                    ? "bg-[#2E7D32]"
                    : index % 3 === 1
                      ? "bg-[#F4C20D]"
                      : "bg-[#1E5AA8]"
                }`}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-white group-hover:shadow-md transition-all duration-500">
                    {iconMap[feature.icon] || <CheckCircle2 className="text-[#2E7D32]" size={32} />}
                  </div>
                  <div
                    className={`transition-transform duration-300 ${activeFeature === feature._id ? "rotate-180" : ""}`}
                  >
                    <ChevronDown className="text-slate-400" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#1E5AA8] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  {feature.description}
                </p>

                <AnimatePresence>
                  {activeFeature === feature._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-6 border-t border-slate-100"
                    >
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        Execution steps{" "}
                        <ChevronRight size={14} className="text-[#1E5AA8]" />
                      </h4>
                      <ul className="space-y-4">
                        {feature.steps?.map((step, idx) => (
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle2
                              size={18}
                              className="text-[#2E7D32] flex-shrink-0"
                            />
                            <span className="text-slate-700 font-semibold text-sm">
                              {step}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {config?.howItWorksFooter && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 text-center"
          >
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-[#2E7D32] to-[#1E5AA8] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 backdrop-blur-3xl" />
              <p className="relative z-10 text-xl font-bold max-w-4xl mx-auto italic">
                "{config.howItWorksFooter}"
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HowItWorks;
