"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/api/axios";
import { BannerSkeleton } from "@/components/ui/Skeleton";
import * as LucideIcons from "lucide-react";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { BannerData, BannerProps } from "@/types";

const Banner = ({ initialData }: BannerProps) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const { data: banners = [], isLoading } = useQuery<BannerData[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/banners");
      return res.data.data;
    },
    initialData,
  });

  console.log(initialData);

  const bannerThemes = [
    {
      button: "bg-brand-red shadow-rose-900/20 hover:bg-rose-700",
      text: "text-brand-red",
    },
    {
      button: "bg-primary shadow-green-900/20 hover:bg-green-800",
      text: "text-primary",
    },
    {
      button: "bg-secondary shadow-blue-900/20 hover:bg-blue-800",
      text: "text-secondary",
    },
  ];

  if (isLoading) return <BannerSkeleton />;
  if (banners.length === 0) return null;

  return (
    <section className="relative lg:h-112.5 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          speed={1500}
          pagination={{
            clickable: true,
            bulletClass:
              "swiper-pagination-bullet !bg-white/30 !w-8 !h-1 !rounded-full !mx-1 !transition-all",
            bulletActiveClass: "!bg-accent !w-12 !opacity-100",
          }}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="h-full w-full"
        >
          {banners.map((banner: BannerData, index: number) => {
            const theme = bannerThemes[index % bannerThemes.length];
            return (
              <SwiperSlide key={banner._id}>
                <div className="relative w-full h-full overflow-hidden">
                  {/* Multi-layered Overlays */}
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${banner.color || "from-black/80 via-black/40 to-transparent"} z-10`}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 z-10" />

                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: activeSlide === index ? 1 : 1.1 }}
                    transition={{ duration: 7, ease: "linear" }}
                  >
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      sizes="100vw"
                      priority={false}
                      loading="eager"
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="relative z-20 h-full max-w-350 mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center pt-10">
                    <AnimatePresence mode="wait">
                      {activeSlide === index && (
                        <div className="max-w-3xl space-y-4">
                          <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.4,
                              duration: 0.8,
                              ease: "circOut",
                            }}
                            className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[0.95] tracking-tightest"
                          >
                            {banner.title
                              .split(" ")
                              .map((word: string, i: number) => (
                                <span key={i} className="inline-block mr-4">
                                  {i % 2 === 1 ? (
                                    <span
                                      className={`${theme.text} inline-block hover:scale-105 transition-transform cursor-default`}
                                    >
                                      {word}
                                    </span>
                                  ) : (
                                    word
                                  )}
                                </span>
                              ))}
                          </motion.h1>

                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-base md:text-lg text-white/70 font-medium max-w-2xl leading-relaxed italic"
                          >
                            {banner.subtitle}
                          </motion.p>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-wrap gap-3 pt-4"
                          >
                            <Link
                              href={banner.ctaLink || "/register"}
                              className={`group relative flex items-center gap-4 px-8 py-3.5 ${theme.button} text-white font-bold rounded-lg overflow-hidden transition-all duration-500 shadow-xl`}
                            >
                              <span className="relative z-10 text-sm flex items-center gap-2">
                                {banner.ctaText || "Become a merchant"}
                                {banner.icon &&
                                  (() => {
                                    const IconComponent = (
                                      LucideIcons as unknown as Record<
                                        string,
                                        React.ComponentType<{
                                          size?: number;
                                          className?: string;
                                        }>
                                      >
                                    )[banner.icon];
                                    return IconComponent ? (
                                      <IconComponent
                                        size={18}
                                        className="relative z-10 shrink-0"
                                      />
                                    ) : null;
                                  })()}
                              </span>
                            </Link>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Modern Slide Indicator */}
      <div className="absolute bottom-10 right-10 z-30 hidden lg:flex items-end gap-6">
        <div className="flex flex-col items-end">
          <div className="text-white/20 font-black text-6xl leading-none tracking-tighter">
            {(activeSlide + 1).toString().padStart(2, "0")}
          </div>
          <div className="text-[#F4C20D] font-black text-[10px] uppercase tracking-widest -mt-2 pr-1">
            Active Hub
          </div>
        </div>
        <div className="w-px h-16 bg-white/10 relative overflow-hidden">
          <motion.div
            key={activeSlide}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 7, ease: "linear" }}
            className="w-full bg-accent shadow-[0_0_15px_#F4C20D]"
          />
        </div>
        <div className="text-white/20 font-black text-2xl leading-none">
          {banners.length.toString().padStart(2, "0")}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-linear-to-b from-accent to-transparent animate-bounce" />
      </motion.div>
    </section>
  );
};

export default Banner;
