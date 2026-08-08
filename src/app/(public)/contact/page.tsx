'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, ArrowUpRight, Send, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { axiosPublic } from '@/api/axios';
import { FaWhatsapp } from 'react-icons/fa6';
import { toast } from 'sonner';

const OFFICE_HOURS = [
  { day: 'Saturday – Thursday', hours: '9:00 AM – 9:00 PM' },
  { day: 'Friday', hours: '2:00 PM – 8:00 PM' },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const { data: config } = useQuery({
    queryKey: ['landing-config'],
    queryFn: async () => {
      const res = await axiosPublic.get('/landing/config');
      return res.data.data;
    },
  });

  const phone = config?.contactInfo?.phone || '+880 1700 000 000';
  const whatsapp = config?.contactInfo?.whatsapp || '8801700000000';
  const email = config?.contactInfo?.email || 'support@gram2city.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axiosPublic.post('/contact', formData);
      if (res.data.success) {
        toast.success('Your message has been sent! We will contact you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const channels = [
    {
      id: 'phone',
      icon: <Phone size={18} />,
      label: 'Phone',
      value: phone,
      cta: 'Call',
      href: `tel:${phone.replace(/\s/g, '')}`,
    },
    {
      id: 'whatsapp',
      icon: <FaWhatsapp size={18} />,
      label: 'WhatsApp',
      value: `+${whatsapp.replace(/[^0-9]/g, '')}`,
      cta: 'Chat',
      href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`,
    },
    {
      id: 'email',
      icon: <Mail size={18} />,
      label: 'Email',
      value: email,
      cta: 'Email',
      href: `mailto:${email}`,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 font-urbanist min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4"
          >
            Contact <span className="text-primary">Support</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-gray-500 dark:text-slate-400 text-base leading-relaxed font-medium"
          >
            Our team is ready to assist you. We respond to all inquiries within 2 hours during
            business days.
          </motion.p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column: Office hours + Channels */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-wide mb-6">
                <Clock size={14} />
                <span>Office hours (BST)</span>
              </div>
              <div className="space-y-4">
                {OFFICE_HOURS.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-800"
                  >
                    <span className="text-gray-600 dark:text-slate-400 text-sm font-medium">
                      {h.day}
                    </span>
                    <span className="text-gray-900 dark:text-white font-bold text-sm">
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Direct Contact Channels
              </p>
              {channels.map((ch, i) => (
                <motion.a
                  key={ch.id}
                  href={ch.href}
                  target={ch.id === 'whatsapp' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-gray-200 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 flex items-center justify-center shadow-sm">
                      {ch.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                        {ch.label}
                      </p>
                      <p className="text-gray-900 dark:text-white text-sm font-bold">{ch.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-secondary transition-colors">
                    <span className="text-xs font-bold hidden sm:inline">{ch.cta}</span>
                    <ArrowUpRight size={14} />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right column: Message Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Tracking inquiry, Merchant partnership, etc."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary hover:bg-secondary text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
