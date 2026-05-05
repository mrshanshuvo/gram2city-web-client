import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { BannerSkeleton } from "../../../components/ui/Skeleton";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Banner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const axiosPublic = useAxios();

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/banners");
      return res.data.data;
    },
  });

  if (isLoading) return <BannerSkeleton />;
  if (banners.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-16 h-[500px] sm:h-[600px] lg:h-[700px]">
      <div className="max-w-7xl mx-auto h-full relative group">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          speed={1000}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-white/40 !w-12 !h-1 !rounded-full !mx-1 !transition-all",
            bulletActiveClass: "!bg-[#F4C20D] !w-16 !opacity-100",
          }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="h-full rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {banners.map((banner: any, index: number) => (
            <SwiperSlide key={banner._id}>
              <div className="relative w-full h-full">
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[4000ms]"
                />

                <div className="relative z-20 h-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {activeSlide === index && (
                      <div className="max-w-2xl space-y-6">
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4C20D] text-black text-xs font-black uppercase tracking-widest shadow-lg shadow-[#F4C20D]/20"
                        >
                          <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                          {banner.badge || "Limited Time Offer"}
                        </motion.div>

                        <motion.h1
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight"
                        >
                          {banner.title.split(" ").map((word: string, i: number) => (
                            <span key={i} className={i % 2 === 1 ? "text-[#F4C20D]" : ""}>
                              {word}{" "}
                            </span>
                          ))}
                        </motion.h1>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-lg md:text-xl text-white/80 font-medium max-w-xl leading-relaxed"
                        >
                          {banner.subtitle}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="flex flex-wrap gap-4 pt-4"
                        >
                          <Link
                            to={banner.ctaLink || "/register"}
                            className="group flex items-center gap-3 px-8 py-4 bg-[#2E7D32] text-white font-black rounded-2xl hover:bg-white hover:text-[#2E7D32] transition-all duration-500 shadow-xl shadow-[#2E7D32]/20"
                          >
                            {banner.ctaText || "Get Started"}
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                          
                          <Link
                            to="/dashboard/trackParcel"
                            className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all duration-500"
                          >
                            Track Delivery
                            <ChevronRight size={18} />
                          </Link>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dynamic Counter */}
        <div className="absolute bottom-10 right-10 z-30 hidden md:flex items-center gap-4">
           <div className="text-white/40 font-black text-6xl tracking-tighter">
             {(activeSlide + 1).toString().padStart(2, "0")}
           </div>
           <div className="w-12 h-[2px] bg-white/20">
              <motion.div 
                key={activeSlide}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-full bg-[#F4C20D]"
              />
           </div>
           <div className="text-white/40 font-black text-2xl">
             {banners.length.toString().padStart(2, "0")}
           </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
