"use client";


import { motion, type Variants } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/api/axios";
import { FaWhatsapp } from "react-icons/fa6";

const OFFICE_HOURS = [
  { day: "Saturday – Thursday", hours: "9:00 AM – 9:00 PM" },
  { day: "Friday", hours: "2:00 PM – 8:00 PM" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

export default function ContactPage() {

  const { data: config } = useQuery({
    queryKey: ["landing-config"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/config");
      return res.data.data;
    },
  });

  const phone = config?.contactInfo?.phone || "+880 1700 000 000";
  const whatsapp = config?.contactInfo?.whatsapp || "8801700000000";
  const email = config?.contactInfo?.email || "support@gram2city.com";
  const address =
    config?.contactInfo?.address ||
    "Plot 45, Gulshan Avenue, Dhaka, Bangladesh";

  const contactCards = [
    {
      icon: <Phone size={22} />,
      label: "Phone",
      value: phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
      cta: "Call now",
      color: "bg-primary",
      glow: "rgba(46,125,50,0.25)",
    },
    {
      icon: <FaWhatsapp size={22} />,
      label: "WhatsApp",
      value: whatsapp,
      href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`,
      cta: "Chat now",
      color: "bg-[#25D366]",
      glow: "rgba(37,211,102,0.2)",
    },
    {
      icon: <Mail size={22} />,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      cta: "Send email",
      color: "bg-[#1E5AA8]",
      glow: "rgba(30,90,168,0.2)",
    },
    {
      icon: <MapPin size={22} />,
      label: "Office",
      value: address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      cta: "Get directions",
      color: "bg-[#E65100]",
      glow: "rgba(230,81,0,0.2)",
    },
  ];



  return (
    <div className="min-h-screen bg-white font-urbanist">
      {/* ── HERO ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-primary">
        {/* Ambient glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-accent/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="relative z-10 max-w-350 mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm border border-white/20"
          >
            <MessageSquare size={12} />
            Get in Touch
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md"
            >
              We&apos;re always
              <br />
              <span className="text-[#F4C20D]">here for you.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18 }}
              className="text-white/70 text-base md:text-lg max-w-sm md:text-right font-medium leading-relaxed"
            >
              Our support team responds within 2 hours on business days. Reach
              us via any channel — we&apos;re always listening.
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── CONTACT CARDS ──────────────────────────────────────── */}
      <div className="max-w-350 mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((card, i) => (
            <motion.a
              key={card.label}
              href={card.href}
              target={
                card.label === "Phone" || card.label === "Email"
                  ? "_self"
                  : "_blank"
              }
              rel="noopener noreferrer"
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              whileHover={{ y: -4 }}
              className="group relative bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              style={{ boxShadow: `0 4px 24px ${card.glow}` }}
            >
              {/* Gradient top strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${card.color} opacity-70 group-hover:opacity-100 transition-opacity`}
              />
              <div
                className={`w-11 h-11 mb-4 rounded-2xl ${card.color} flex items-center justify-center text-white shadow-lg`}
              >
                {card.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-1">
                {card.label}
              </p>
              <p className="text-sm font-bold text-slate-800 leading-snug mb-3 line-clamp-2">
                {card.value}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 group-hover:text-slate-900 transition-colors">
                {card.cta}
                <ArrowRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* ── CONTACT INFO DETAILS ──────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Office Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary rounded-3xl p-7 text-white relative overflow-hidden shadow-xl"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#4CAF50]">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-black text-base">Office Hours</h3>
                  <p className="text-gray-400 text-xs font-medium">
                    Bangladesh Standard Time
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {OFFICE_HOURS.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0"
                  >
                    <span className="text-gray-400 text-xs font-bold">
                      {h.day}
                    </span>
                    <span className="text-white text-xs font-black bg-white/10 px-3 py-1 rounded-lg">
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                WhatsApp & email support available outside office hours —
                responses by next business day.
              </p>
            </div>
          </motion.div>

          {/* Quick Response Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-50 rounded-3xl p-7 border border-slate-100 shadow-sm"
          >
            <h3 className="font-black text-slate-900 mb-6">
              Typical Response Times
            </h3>
            <div className="space-y-4">
              {[
                {
                  channel: "Phone Call",
                  time: "Immediate",
                  color: "bg-primary",
                },
                {
                  channel: "WhatsApp",
                  time: "< 30 minutes",
                  color: "bg-[#25D366]",
                },
                {
                  channel: "Email",
                  time: "< 2 hours",
                  color: "bg-[#1E5AA8]",
                },
              ].map((r) => (
                <div
                  key={r.channel}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                    <span className="text-sm font-bold text-slate-700">
                      {r.channel}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    {r.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>


        </div>
      </div>

      {/* ── MAP EMBED ──────────────────────────────────────────── */}
      <div className="max-w-350 mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden border border-slate-100 shadow-lg h-80"
        >
          <iframe
            title="Gram2City Office Location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=14&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(10%) contrast(105%)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </div>
  );
}
