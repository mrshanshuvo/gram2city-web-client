import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { ArrowRight, Package, ShieldCheck, Zap, Globe, Headset } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="text-[#F4C20D]" size={24} />,
  ShieldCheck: <ShieldCheck className="text-[#F4C20D]" size={24} />,
  Package: <Package className="text-[#F4C20D]" size={24} />,
  Globe: <Globe className="text-[#F4C20D]" size={24} />,
  Headset: <Headset className="text-[#F4C20D]" size={24} />,
};

interface BannerSlide {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  icon: string;
  color: string;
}

const Banner = () => {
  const axiosPublic = useAxios();

  const { data: slides = [], isLoading } = useQuery<BannerSlide[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/banners");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 mb-16 h-[500px] sm:h-[600px]">
        <div className="w-full h-full bg-gray-100 rounded-[2.5rem] animate-pulse flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="w-48 h-8 bg-gray-200 rounded-full mx-auto" />
            <div className="w-96 h-12 bg-gray-200 rounded-2xl mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group px-4 sm:px-6 lg:px-8 mb-16">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        loop={slides.length > 1}
        className="rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px] sm:h-[600px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <img
                src={slide.image}
                className="absolute inset-0 w-full h-full object-cover"
                alt={slide.title}
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.color || "from-black/60 to-black/40"} backdrop-blur-[2px]`}
              />

              {/* Content Container */}
              <div className="relative h-full flex items-center px-8 sm:px-16 lg:px-24">
                <div className="max-w-2xl text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      {iconMap[slide.icon] || <Zap className="text-[#F4C20D]" size={24} />}
                    </div>
                    <span className="text-sm font-bold tracking-widest uppercase text-[#F4C20D]">
                      Premium Delivery Service
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl sm:text-6xl font-black mb-6 leading-tight"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed font-medium"
                  >
                    {slide.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link
                      to={slide.ctaLink}
                      className="group/btn relative px-8 py-4 bg-[#F4C20D] text-black font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(244,194,13,0.4)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {slide.ctaText}
                        <ArrowRight
                          size={20}
                          className="transition-transform duration-300 group-hover/btn:translate-x-1"
                        />
                      </span>
                    </Link>

                    <Link
                      to="/coverage"
                      className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      Explore Coverage
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <button className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20">
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <button className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20">
          <ArrowRight size={24} />
        </button>
      </Swiper>

      {/* Search Overlay Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20"
      >
        <div className="glass p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Package
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2E7D32]"
              size={20}
            />
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g., G2C-XXXXXX)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white/50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32] transition-all outline-none font-bold text-slate-800"
            />
          </div>
          <button className="w-full md:w-auto px-10 py-4 bg-[#2E7D32] text-white font-bold rounded-2xl hover:bg-[#1E5AA8] transition-all duration-300 shadow-lg shadow-[#2E7D32]/20">
            Track Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Banner;
