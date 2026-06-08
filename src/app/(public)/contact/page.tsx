"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/api/axios";
import { FaWhatsapp } from "react-icons/fa6";

const OFFICE_HOURS = [
  { day: "Saturday – Thursday", hours: "9:00 AM – 9:00 PM" },
  { day: "Friday", hours: "2:00 PM – 8:00 PM" },
];

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

  const channels = [
    {
      id: "phone",
      icon: <Phone size={18} />,
      label: "Phone",
      value: phone,
      cta: "Call",
      href: `tel:${phone.replace(/\s/g, "")}`,
    },
    {
      id: "whatsapp",
      icon: <FaWhatsapp size={18} />,
      label: "WhatsApp",
      value: `+${whatsapp.replace(/[^0-9]/g, "")}`,
      cta: "Chat",
      href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`,
    },
    {
      id: "email",
      icon: <Mail size={18} />,
      label: "Email",
      value: email,
      cta: "Email",
      href: `mailto:${email}`,
    },
  ];

  return (
    <div className="bg-white font-urbanist">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-4"
          >
            Contact support
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-gray-500 text-base leading-relaxed"
          >
            Our team is ready to assist you. We respond to all inquiries within
            2 hours during business days.
          </motion.p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column: Office hours */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wide mb-6">
              <Clock size={14} />
              <span>Office hours (BST)</span>
            </div>
            <div className="space-y-4">
              {OFFICE_HOURS.map((h) => (
                <div
                  key={h.day}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600 text-sm">{h.day}</span>
                  <span className="text-gray-900 font-medium text-sm">
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 leading-relaxed">
                <span className="font-medium text-gray-700">
                  Average response:
                </span>{" "}
                Phone calls are answered immediately. WhatsApp and email within
                2 hours.
              </p>
            </div>
          </motion.div>

          {/* Right column: Contact channels */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            {channels.map((ch, i) => (
              <motion.a
                key={ch.id}
                href={ch.href}
                target={ch.id === "whatsapp" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center justify-between p-5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-white transition-colors">
                    {ch.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                      {ch.label}
                    </p>
                    <p className="text-gray-900 text-sm font-medium">
                      {ch.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-600 transition-colors">
                  <span className="text-xs font-medium hidden sm:inline">
                    {ch.cta}
                  </span>
                  <ArrowUpRight size={14} />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
