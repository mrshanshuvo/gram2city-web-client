import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Marquee from "react-fast-marquee";
import useAxios from "../../../hooks/useAxios";

interface PartnerLogo {
  _id: string;
  name: string;
  logo: string;
}

const TopEnterprises = () => {
  const axiosPublic = useAxios();

  const { data: partners = [], isLoading } = useQuery<PartnerLogo[]>({
    queryKey: ["partners"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get("/landing/partners");
        return res.data.data;
      } catch (error) {
        console.error("Failed to fetch partners", error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <div className="py-24 bg-white animate-pulse">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-20 bg-slate-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (partners.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Subtle Section Label */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-slate-500 font-black uppercase tracking-[0.4em]"
          >
            Top Enterprises
          </motion.p>
        </div>

        <div className="relative group">
          {/* Faded Edges for a Cinematic Look */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Premium Marquee Layer */}
          <Marquee
            autoFill={true}
            gradient={false}
            speed={50}
            pauseOnHover={true}
            className="flex items-center"
          >
            {partners.map((partner: any) => (
              <div
                key={partner._id}
                className="mx-10 flex items-center justify-center h-20 px-4"
              >
                <div className="transition-all duration-700 cursor-pointer">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-12 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default TopEnterprises;
