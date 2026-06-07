"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  X,
  Save,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Hash,
  Upload,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Banner } from "../../../features/landing/types";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData | Banner) => void;
  initialData?: Banner;
  isLoading?: boolean;
}

const BannerModal: React.FC<BannerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      buttonText: "Learn More",
      buttonLink: "/",
      order: 0,
      isActive: true,
    },
  });

  // Sync form values and preview when initialData changes (edit vs. create)
  useEffect(() => {
    reset(
      initialData || {
        title: "",
        subtitle: "",
        buttonText: "Learn More",
        buttonLink: "/",
        order: 0,
        isActive: true,
      },
    );
    setPreviewUrl(initialData?.image || "");
    setSelectedFile(null);
  }, [initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFormSubmit = (formValues: Banner) => {
    // Image required on create, optional on edit (keeps existing if no new file)
    if (!selectedFile && !initialData?.image) {
      toast.error("Please upload a banner image.");
      return;
    }

    const fd = new FormData();
    if (selectedFile) fd.append("image", selectedFile);
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    });

    onSubmit(fd);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
          >
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {initialData ? "Edit Banner Slide" : "Add New Banner"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Hero section visual content management
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="p-8 space-y-6 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload Area */}
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">
                    Banner Asset (8K Ultra HD Recommended)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative h-64 w-full rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group ${
                      previewUrl
                        ? "border-primary/30"
                        : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                    }`}
                  >
                    {previewUrl ? (
                      <>
                        <Image
                          src={previewUrl}
                          fill
                          sizes="(max-width: 768px) 100vw, 800px"
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 font-black text-sm text-slate-900">
                            <Upload size={16} /> Change Image
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-2 p-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto group-hover:scale-110 transition-transform">
                          <ImageIcon size={32} />
                        </div>
                        <p className="text-slate-500 font-bold">
                          Click to upload banner image
                        </p>
                        <p className="text-slate-400 text-xs font-medium">
                          PNG, JPG or WebP (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} />
                    Main Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g. Fastest Delivery in BD"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-slate-700"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 font-bold">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Hash size={12} />
                    Display Order
                  </label>
                  <input
                    type="number"
                    {...register("order", { valueAsNumber: true })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} />
                    Subtitle / Description
                  </label>
                  <textarea
                    {...register("subtitle")}
                    rows={2}
                    placeholder="Describe the value proposition..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} />
                    Button Text
                  </label>
                  <input
                    {...register("buttonText")}
                    placeholder="Learn More"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <LinkIcon size={12} />
                    Button Link
                  </label>
                  <input
                    {...register("buttonLink")}
                    placeholder="/tracking"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Status
                  </label>
                  <div className="flex gap-4 p-1 bg-slate-100 rounded-xl w-fit">
                    <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register("isActive")}
                        value="true"
                        defaultChecked={initialData?.isActive !== false}
                      />
                      <span className="text-xs font-black text-slate-700">
                        Active
                      </span>
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register("isActive")}
                        value="false"
                        defaultChecked={initialData?.isActive === false}
                      />
                      <span className="text-xs font-black text-slate-500">
                        Inactive
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3.5 rounded-2xl text-slate-500 font-black hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-3.5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} /> Save Slide
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BannerModal;
