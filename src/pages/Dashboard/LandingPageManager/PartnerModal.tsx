import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Save,
  Building2,
  Hash,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosSecure } from "../../../api/axios";
import { toast } from "sonner";
import { Partner } from "../../../features/landing/types";

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partner) => void;
  initialData?: Partner;
  isLoading?: boolean;
}

const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData?.logo || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: initialData || {
      name: "",
      logo: "",
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
        setValue("logo", res.data.url);
        toast.success("Partner logo uploaded!");
      }
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Upload failed.";
      toast.error(errorMsg);
      setPreviewUrl(initialData?.logo || "");
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
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
          >
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {initialData ? "Edit Partner" : "Add New Partner"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Manage industry trust logos
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">
                    Partner Logo (Transparent PNG Recommended)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative h-32 w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group ${
                      previewUrl
                        ? "border-[#2E7D32]/30"
                        : "border-slate-200 hover:border-[#2E7D32]/50 hover:bg-slate-50"
                    }`}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        className="max-h-20 max-w-[80%] object-contain grayscale group-hover:grayscale-0 transition-all"
                        alt="Logo"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon
                          size={24}
                          className="text-slate-300 mx-auto"
                        />
                        <p className="text-slate-400 text-xs font-bold mt-1">
                          Upload logo
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2
                          className="animate-spin text-[#2E7D32]"
                          size={20}
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
                    {...register("logo", { required: "Logo is required" })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Building2 size={12} />
                    Partner Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
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
              </div>

              <div className="pt-6 flex justify-end gap-4">
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
                      <Save size={20} /> Save Partner
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

export default PartnerModal;

