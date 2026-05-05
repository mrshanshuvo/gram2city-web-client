import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Globe,
  Package,
  Banknote,
  Building2,
  Repeat,
  ArrowRight,
  ShieldCheck,
  Headset,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import Skeleton from "../../../components/ui/Skeleton";

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="text-white" size={32} />,
  Globe: <Globe className="text-white" size={32} />,
  Package: <Package className="text-white" size={32} />,
  Banknote: <Banknote className="text-white" size={32} />,
  Building2: <Building2 className="text-white" size={32} />,
  Repeat: <Repeat className="text-white" size={32} />,
  ShieldCheck: <ShieldCheck className="text-white" size={32} />,
  Headset: <Headset className="text-white" size={32} />,
};

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

const OurServices: React.FC = () => {
  const axiosPublic = useAxios();

  const { data: services = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/services");
      return res.data.data;
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <section className="py-24 px-4 bg-[#0F172A] rounded-[3rem] mb-20">
        <div className="max-w-7xl mx-auto space-y-12">
           <div className="text-center space-y-4">
              <Skeleton className="h-4 w-32 mx-auto rounded-full" dark />
              <Skeleton className="h-12 w-3/4 mx-auto" dark />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 space-y-6">
                   <Skeleton className="h-16 w-16" dark />
                   <Skeleton className="h-8 w-3/4" dark />
                   <Skeleton className="h-20 w-full" dark />
                </div>
              ))}
           </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] rounded-[3rem] text-center overflow-hidden relative mb-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2E7D32]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1E5AA8]/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#F4C20D] text-sm font-bold uppercase tracking-[0.2em] mb-4 block"
          >
            Our Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight"
          >
            Delivery Solutions for Every Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Explore our specialized logistics services designed to handle everything 
            from small envelopes to complex corporate shipments.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service._id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 text-left"
            >
              <div className="mb-8 relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color || "from-[#2E7D32] to-[#1E5AA8]"} flex items-center justify-center shadow-lg shadow-[#2E7D32]/20 group-hover:scale-110 transition-transform duration-500`}>
                  {iconMap[service.icon] || <Package className="text-white" size={32} />}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#F4C20D] transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-8">
                {service.description}
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#F4C20D] transition-colors cursor-pointer">
                Learn More{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurServices;
