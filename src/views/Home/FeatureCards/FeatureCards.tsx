import { motion } from "framer-motion";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../../../api/axios";

const colorMap: { [key: string]: string } = {
  0: "from-primary/20 to-transparent",
  1: "from-blue-500/20 to-transparent",
  2: "from-amber-500/20 to-transparent",
};

interface FeatureItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
}

const FeatureCards = () => {
  const { data: features = [], isLoading } = useQuery<FeatureItem[]>({
    queryKey: ["features"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/features");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-10 max-w-350 mx-auto px-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 relative overflow-hidden bg-white">
      <div className="max-w-350 mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight"
          >
            Why Choose <span className="text-[#2E7D32]">Gram</span>
            <span className="text-[#F4C20D]">2</span>
            <span className="text-[#1E5AA8]">City</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-slate-50/50 rounded-xl border border-slate-100 p-6 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-700 flex flex-col items-center text-center"
            >
              {/* Image Header with Mesh Glow */}
              <div className="relative w-full h-40 mb-4 flex items-center justify-center">
                <div
                  className={`absolute inset-0 bg-linear-to-br ${colorMap[index % 3] || "from-slate-100 to-transparent"} opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-700 rounded-xl`}
                />
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="z-10 object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl rounded-xl"
                />
              </div>

              {/* Title Content */}
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 leading-tight tracking-tight px-4 group-hover:text-primary transition-colors duration-500">
                  {feature.title}
                </h3>
              </div>

              {/* Decorative Corner */}
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/20 transition-all duration-700 rounded-br-xl" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-primary/5 blur-[100px] rounded-full -ml-24" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 bg-accent/5 blur-[100px] rounded-full -mr-24" />
    </section>
  );
};

export default FeatureCards;
