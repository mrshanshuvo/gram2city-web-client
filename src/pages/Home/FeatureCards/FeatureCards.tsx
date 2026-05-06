import { motion } from "framer-motion";
import { ShieldCheck, Truck, Headset, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

const iconMap: Record<string, React.ReactNode> = {
  Truck: <Truck className="text-[#2E7D32]" size={24} />,
  ShieldCheck: <ShieldCheck className="text-[#1E5AA8]" size={24} />,
  Headset: <Headset className="text-[#F4C20D]" size={24} />,
};

const colorMap: Record<string, string> = {
  Truck: "from-[#2E7D32]/10 to-transparent",
  ShieldCheck: "from-[#1E5AA8]/10 to-transparent",
  Headset: "from-[#F4C20D]/10 to-transparent",
};

interface FeatureItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
}

const FeatureCards = () => {
  const axiosPublic = useAxios();

  const { data: features = [], isLoading } = useQuery<FeatureItem[]>({
    queryKey: ["features"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/features");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-16 max-w-7xl mx-auto px-6 sm:px-8 animate-pulse">
        <div className="w-96 h-12 bg-slate-100 rounded-2xl mx-auto mb-24" />
        <div className="space-y-32">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col lg:flex-row gap-12">
              <div className="w-full lg:w-1/2 h-[400px] bg-slate-100 rounded-[3rem]" />
              <div className="w-full lg:w-1/2 space-y-8 py-10">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl" />
                <div className="w-3/4 h-10 bg-slate-100 rounded-xl" />
                <div className="w-full h-24 bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-widest"
          >
            Why Choose Gram2City
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight"
          >
            The Standard in{" "}
            <span className="text-[#2E7D32]">Modern Logistics</span>
          </motion.h2>
        </div>

        <div className="flex flex-col gap-32">
          {features.map((feature, index) => (
            <motion.div
              key={feature._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-24`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2 group">
                <div
                  className={`relative rounded-[3rem] p-8 bg-gradient-to-br ${colorMap[feature.icon] || "from-slate-100 to-transparent"} overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-[400px] object-contain drop-shadow-2xl"
                    />
                  </motion.div>
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="inline-flex p-4 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-50">
                  {iconMap[feature.icon] || (
                    <Truck className="text-[#2E7D32]" size={24} />
                  )}
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="flex items-center gap-2 text-[#2E7D32] font-black text-sm uppercase tracking-widest group/link">
                    Learn more{" "}
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover/link:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background patterns */}
      <div className="absolute top-0 right-0 -z-10 opacity-5">
        <div className="w-[800px] h-[800px] border-[100px] border-slate-900 rounded-full -mr-[400px] -mt-[400px]" />
      </div>
    </section>
  );
};

export default FeatureCards;
