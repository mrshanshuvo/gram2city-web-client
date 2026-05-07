import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Save,
  Image as ImageIcon,
  Type,
  Hash,
  Upload,
  Loader2,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "sonner";

import { Feature } from '../../../features/landing/types';

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Feature) => void;
  initialData?: Feature;
  isLoading?: boolean;
}

const FeatureModal: React.FC<FeatureModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      image: "",
      icon: "Zap",
      order: 0,
      isActive: true,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosSecure.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setValue("image", res.data.url);
        toast.success("Feature image uploaded!");
      }
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (err as Error).message || "Upload failed.";
      toast.error(errorMsg);
      setPreviewUrl(initialData?.image || "");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
          >
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {initialData ? "Edit Feature" : "Add New Feature"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Secondary highlights and features
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
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 space-y-6 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">
                    Feature Image
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative h-48 w-full rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group ${
                      previewUrl
                        ? "border-[#2E7D32]/30"
                        : "border-slate-200 hover:border-[#2E7D32]/50 hover:bg-slate-50"
                    }`}
                  >
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
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
                      <div className="text-center space-y-1">
                        <ImageIcon
                          size={24}
                          className="text-slate-300 mx-auto"
                        />
                        <p className="text-slate-500 font-bold text-sm">
                          Upload feature image
                        </p>
                      </div>
                    )}

                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <Loader2
                          className="animate-spin text-[#2E7D32]"
                          size={24}
                        />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <input
                    type="hidden"
                    {...register("image", { required: "Image is required" })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} />
                    Feature Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Zap size={12} />
                    Icon Name
                  </label>
                  <input
                    {...register("icon")}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={2}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-medium text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Hash size={12} />
                    Order
                  </label>
                   <input
                    type="number"
                    {...register("order", { valueAsNumber: true })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="md:col-span-2 pt-4 border-t border-slate-50 flex items-center justify-between">
                   <div>
                      <h4 className="font-black text-slate-900">Live Visibility</h4>
                      <p className="text-xs text-slate-400 font-medium">Instantly toggle this feature on the landing page</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" {...register("isActive")} className="sr-only peer" />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2E7D32]"></div>
                   </label>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3.5 rounded-2xl text-slate-500 font-black hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || uploading}
                  className="px-10 py-3.5 rounded-2xl bg-[#2E7D32] text-white font-black shadow-xl shadow-[#2E7D32]/20 hover:bg-[#1E5AA8] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={20} /> Save Feature
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

export default FeatureModal;

