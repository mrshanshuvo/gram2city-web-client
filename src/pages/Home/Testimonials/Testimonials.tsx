import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCreative } from "swiper/modules";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import Skeleton from "../../../components/ui/Skeleton";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

interface TestimonialItem {
  _id: string;
  name: string;
  title: string;
  quote: string;
  image: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  const axiosPublic = useAxios();

  const { data: testimonials = [], isLoading } = useQuery<TestimonialItem[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/testimonials");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-10 rounded-[2.5rem] space-y-6 shadow-sm border border-slate-100"
            >
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-24 w-full" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback if no testimonials in DB yet
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            What Our <span className="text-[#1E5AA8]">Clients Say</span>
          </motion.h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay, EffectCreative]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-20 testimonials-swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={testimonial._id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col relative group hover:border-[#1E5AA8]/30 transition-colors duration-500"
              >
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote size={60} className="text-[#1E5AA8]" />
                </div>

                <div className="flex gap-1 mb-8">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-[#F4C20D] text-[#F4C20D]"
                    />
                  ))}
                </div>

                <p className="text-slate-700 font-semibold italic text-lg leading-relaxed mb-10 flex-grow">
                  “{testimonial.quote}”
                </p>

                <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-14 w-14 rounded-2xl object-cover ring-4 ring-slate-50"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2E7D32] rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-none mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
