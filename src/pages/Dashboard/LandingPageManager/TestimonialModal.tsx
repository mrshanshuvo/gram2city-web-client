import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { X, Save, User, MessageSquare, Star, Upload, Loader2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "sonner";

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  isLoading 
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: initialData || {
      name: "",
      title: "",
      quote: "",
      image: "",
      rating: 5,
      isActive: true
    }
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
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        setValue("image", res.data.url);
        toast.success("Client avatar uploaded!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed.");
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
                  {initialData ? "Edit Testimonial" : "Add Testimonial"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">Curate customer success stories</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center gap-4 md:col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden cursor-pointer group bg-white shadow-inner border-2 border-dashed border-slate-200"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Client" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                         <User size={40} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Upload size={16} className="text-white" />
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                         <Loader2 className="animate-spin text-[#2E7D32]" size={20} />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Client Avatar</p>
                     <p className="text-[10px] text-slate-400 font-medium">Square images look best</p>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <input type="hidden" {...register("image", { required: "Client image is required" })} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={12} />
                    Client Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. John Doe"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Briefcase size={12} />
                    Client Title / Role
                  </label>
                  <input
                    {...register("title")}
                    placeholder="e.g. CEO at TechCorp"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MessageSquare size={12} />
                    The Quote
                  </label>
                  <textarea
                    {...register("quote", { required: "Quote is required" })}
                    rows={4}
                    placeholder="What did they say about Gram2City?"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-medium text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Star size={12} />
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    {...register("rating", { valueAsNumber: true })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4 flex-shrink-0">
                <button type="button" onClick={onClose} className="px-8 py-3.5 rounded-2xl text-slate-500 font-black hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || uploading}
                  className="px-10 py-3.5 rounded-2xl bg-[#2E7D32] text-white font-black shadow-xl shadow-[#2E7D32]/20 hover:bg-[#1E5AA8] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : <><Save size={20} /> Save Testimonial</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TestimonialModal;
