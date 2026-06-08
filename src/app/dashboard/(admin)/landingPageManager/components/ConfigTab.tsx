"use client";

import { Layout, Globe, UserCircle, Zap, Save, Loader2 } from "lucide-react";
import { LandingConfig } from "@/features/landing/types";

interface ConfigTabProps {
  config: LandingConfig | undefined;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
}

export default function ConfigTab({ config, onSubmit, isSaving }: ConfigTabProps) {
  return (
    <div className="max-w-4xl">
      <form onSubmit={onSubmit} className="space-y-12">
        {/* Merchant Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Layout className="text-[#2E7D32]" size={24} />
            Merchant Section
          </h2>
          <div className="space-y-4 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Headline
              </label>
              <input
                name="title"
                defaultValue={config?.merchantSection?.title}
                className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={config?.merchantSection?.description}
                className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  CTA Text
                </label>
                <input
                  name="ctaText"
                  defaultValue={config?.merchantSection?.ctaText}
                  className="w-full p-4 rounded-2xl border border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  CTA Link
                </label>
                <input
                  name="ctaLink"
                  defaultValue={config?.merchantSection?.ctaLink}
                  className="w-full p-4 rounded-2xl border border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Benefits (Comma separated)
              </label>
              <input
                name="benefits"
                defaultValue={config?.merchantSection?.benefits?.join(", ")}
                className="w-full p-4 rounded-2xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Globe className="text-[#1E5AA8]" size={24} />
            Contact Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Address
              </label>
              <input
                name="address"
                defaultValue={config?.contactInfo?.address}
                className="w-full p-4 rounded-2xl border border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Phone
              </label>
              <input
                name="phone"
                defaultValue={config?.contactInfo?.phone}
                className="w-full p-4 rounded-2xl border border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                WhatsApp
              </label>
              <input
                name="whatsapp"
                defaultValue={config?.contactInfo?.whatsapp}
                className="w-full p-4 rounded-2xl border border-slate-200"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                name="email"
                defaultValue={config?.contactInfo?.email}
                className="w-full p-4 rounded-2xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <UserCircle className="text-[#F4C20D]" size={24} />
            Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            {["Twitter", "Facebook", "LinkedIn", "Instagram", "YouTube"].map((s) => (
              <div key={s} className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  {s}
                </label>
                <input
                  name={s.toLowerCase()}
                  defaultValue={config?.socialLinks?.[s.toLowerCase() as keyof LandingConfig["socialLinks"]]}
                  className="w-full p-4 rounded-2xl border border-slate-200"
                  placeholder={`https://${s.toLowerCase()}.com/...`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SEO & Marketing */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="text-[#F4C20D]" size={24} />
            SEO & Social Marketing
          </h2>
          <div className="space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  SEO Title (Google)
                </label>
                <input
                  name="seoTitle"
                  defaultValue={config?.seo?.title}
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10"
                  placeholder="e.g. Gram2City | Fastest Village to City Logistics"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  SEO Keywords
                </label>
                <input
                  name="seoKeywords"
                  defaultValue={config?.seo?.keywords}
                  className="w-full p-4 rounded-2xl border border-slate-200"
                  placeholder="logistics, shipping, bangladesh, delivery"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Meta Description
              </label>
              <textarea
                name="seoDescription"
                rows={3}
                defaultValue={config?.seo?.description}
                className="w-full p-4 rounded-2xl border border-slate-200"
                placeholder="Tell Google what your site is about..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                OpenGraph Share Image (URL)
              </label>
              <input
                name="seoImage"
                defaultValue={config?.seo?.image}
                className="w-full p-4 rounded-2xl border border-slate-200"
                placeholder="https://your-site.com/share-image.jpg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-12 py-5 bg-primary text-white rounded-2xl font-black shadow-xl flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
