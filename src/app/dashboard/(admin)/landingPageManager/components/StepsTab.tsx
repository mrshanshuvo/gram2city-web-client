"use client";

import { Edit3, Trash2 } from "lucide-react";
import { ProcessStep } from "@/features/landing/types";

interface StepsTabProps {
  processSteps: ProcessStep[];
  selectedItems: string[];
  toggleSelectItem: (id: string) => void;
  onEdit: (step: ProcessStep) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  renderBulkActionsBar: () => React.ReactNode;
  AddButton: React.ComponentType<{ label: string; onClick: () => void }>;
}

export default function StepsTab({
  processSteps,
  selectedItems,
  toggleSelectItem,
  onEdit,
  onDelete,
  onAdd,
  renderBulkActionsBar,
  AddButton,
}: StepsTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-900">How it Works</h3>
        <AddButton label="Add Step" onClick={onAdd} />
      </div>
      {renderBulkActionsBar()}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processSteps.map((step: ProcessStep) => (
          <div
            key={step._id}
            className={`p-6 bg-slate-50 rounded-3xl border border-slate-200 ${
              selectedItems.includes(step._id as string)
                ? "ring-2 ring-primary border-transparent"
                : ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(step._id as string)}
                  onChange={() => toggleSelectItem(step._id as string)}
                  className="checkbox checkbox-primary checkbox-sm bg-white rounded-lg shadow-sm cursor-pointer"
                />
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black">
                  {step.order}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(step)}
                  className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => onDelete(step._id as string)}
                  className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 className="font-black text-lg text-slate-900">{step.title || ""}</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
