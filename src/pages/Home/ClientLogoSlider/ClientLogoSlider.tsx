import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import "swiper/css";

interface PartnerLogo {
  _id: string;
  name: string;
  logo: string;
}

const ClientLogoSlider = () => {
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

  const displayPartners = partners.length > 0 ? partners : [];
  if (displayPartners.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] mb-4"
          >
            Trusted by Industry Leaders
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black text-slate-900"
          >
            Powering Logistics for Global Brands
          </motion.h3>
        </div>

        <div className="relative">
          {/* Faded edges for the marquee effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 hidden md:block" />

          <Swiper
            modules={[Autoplay]}
            spaceBetween={50}
            slidesPerView={2}
            loop={displayPartners.length > 5}
            speed={3000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="logo-swiper-linear pointer-events-none"
          >
            {/* Double the logos for smoother loop */}
            {[...displayPartners, ...displayPartners].map((partner, index) => (
              <SwiperSlide key={`${partner._id || index}-${index}`}>
                <div className="flex items-center justify-center h-20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer pointer-events-auto">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-12 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .logo-swiper-linear .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `,
        }}
      />
    </section>
  );
};

export default ClientLogoSlider;
