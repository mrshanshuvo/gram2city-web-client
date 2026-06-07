import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Save,
  Zap,
  Type,
  Hash,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Service } from "@/features/landing/types";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Service) => void;
  initialData?: Service;
  isLoading?: boolean;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      icon: "Zap",
      order: 0,
      isActive: true,
    },
  });

  // Sync form values when initialData changes (edit vs. create)
  useEffect(() => {
    reset(
      initialData || {
        title: "",
        description: "",
        icon: "Zap",
        order: 0,
        isActive: true,
      }
    );
  }, [initialData, reset]);

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
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {initialData ? "Edit Service Card" : "Add New Service"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Define your logistics value prop
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} />
                    Service Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g. Express Home Delivery"
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
                    <FileText size={12} />
                    Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={3}
                    placeholder="Short description of this service..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-600"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 font-bold">
                      {errors.description.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ImageIcon size={12} />
                    Illustration Image Path
                  </label>
                  <input
                    {...register("image")}
                    placeholder="/images/services/truck.png"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-slate-700"
                  />
                  <p className="text-[10px] text-slate-400 font-bold ml-1">
                    Path to the illustration asset (e.g.
                    /images/services/truck.png)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Zap size={12} />
                      Fallback Icon Name
                    </label>
                    <input
                      {...register("icon")}
                      placeholder="Zap, Box, Truck..."
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-slate-700"
                    />
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
                  disabled={isLoading}
                  className="px-10 py-3.5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={20} /> Save Service
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

export default ServiceModal;
