import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Save, Settings, Type, Hash, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProcessStep } from "../../../features/landing/types";

interface ProcessStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProcessStep) => void;
  initialData?: ProcessStep;
  isLoading?: boolean;
}

const ProcessStepModal: React.FC<ProcessStepModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [subSteps, setSubSteps] = useState<string[]>(
    initialData?.steps || [""],
  );

  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      icon: "Settings",
      order: 0,
      isActive: true,
    },
  });

  // Sync form values and sub-steps when initialData changes (edit vs. create)
  useEffect(() => {
    reset(
      initialData || {
        title: "",
        description: "",
        icon: "Settings",
        order: 0,
        isActive: true,
      }
    );
    setSubSteps(initialData?.steps || [""]);
  }, [initialData, reset]);

  const handleAddSubStep = () => setSubSteps([...subSteps, ""]);
  const handleRemoveSubStep = (index: number) =>
    setSubSteps(subSteps.filter((_, i) => i !== index));
  const handleSubStepChange = (index: number, value: string) => {
    const newSteps = [...subSteps];
    newSteps[index] = value;
    setSubSteps(newSteps);
  };

  const onFormSubmit = (data: Partial<ProcessStep>) => {
    onSubmit({
      ...data,
      steps: subSteps.filter((s) => s.trim() !== ""),
    } as ProcessStep);
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
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
          >
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {initialData ? "Edit Process Step" : "Add Process Step"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Manage the "How it Works" flow
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
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-8 space-y-6 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} />
                    Step Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g. 01. Register"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Settings size={12} />
                    Lucide Icon
                  </label>
                  <input
                    {...register("icon")}
                    placeholder="UserPlus, Package, etc."
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} />
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={2}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-600"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      Sub-steps / Bullet Points
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSubStep}
                      className="text-primary text-xs font-black hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Step
                    </button>
                  </div>

                  <div className="space-y-3">
                    {subSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-3">
                        <input
                          value={step}
                          onChange={(e) =>
                            handleSubStepChange(idx, e.target.value)
                          }
                          placeholder={`Sub-step ${idx + 1}`}
                          className="grow px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 font-medium text-sm text-slate-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSubStep(idx)}
                          className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Hash size={12} />
                    Order
                  </label>
                  <input
                    type="number"
                    {...register("order", { valueAsNumber: true })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-slate-700"
                  />
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
                    "Saving..."
                  ) : (
                    <>
                      <Save size={20} /> Save Process
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

export default ProcessStepModal;
