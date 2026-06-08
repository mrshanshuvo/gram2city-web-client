"use client";

import { Wand2, Trash2 } from "lucide-react";
import { Avatar } from "@/features/landing/types";

interface AvatarsTabProps {
  avatars: Avatar[];
  selectedItems: string[];
  toggleSelectItem: (id: string) => void;
  onDelete: (id: string) => void;
  onMagicGenerate: () => void;
  generatePending: boolean;
  renderBulkActionsBar: () => React.ReactNode;
}

export default function AvatarsTab({
  avatars,
  selectedItems,
  toggleSelectItem,
  onDelete,
  onMagicGenerate,
  generatePending,
  renderBulkActionsBar,
}: AvatarsTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <div>
          <h3 className="text-xl font-black text-slate-900">Avatar Vault</h3>
          <p className="text-slate-500 font-medium text-sm">
            Magic generation for user profiles
          </p>
        </div>
        <button
          onClick={onMagicGenerate}
          disabled={generatePending}
          className="btn bg-accent hover:bg-[#EBC00D] text-slate-900 rounded-2xl font-black gap-2"
        >
          <Wand2 size={20} /> {generatePending ? "Generating..." : "Magic Generate"}
        </button>
      </div>
      {renderBulkActionsBar()}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
        {avatars.map((a: Avatar) => (
          <div
            key={a._id}
            className={`relative group bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center ${
              selectedItems.includes(a._id) ? "ring-2 ring-primary border-transparent" : ""
            }`}
          >
            <div className="absolute top-1 left-1 z-20">
              <input
                type="checkbox"
                checked={selectedItems.includes(a._id)}
                onChange={() => toggleSelectItem(a._id)}
                className="checkbox checkbox-primary checkbox-xs bg-white rounded shadow-sm cursor-pointer"
              />
            </div>
            <img src={a.url} className="w-16 h-16 rounded-xl shadow-sm" alt="" />
            <button
              onClick={() => onDelete(a._id)}
              className="absolute -top-2 -right-2 p-1.5 bg-white rounded-lg text-red-500 opacity-0 group-hover:opacity-100 shadow-md"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
