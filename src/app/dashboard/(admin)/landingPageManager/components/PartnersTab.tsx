"use client";

import { Edit3, Trash2 } from "lucide-react";
import { Partner } from "@/features/landing/types";

interface PartnersTabProps {
  partners: Partner[];
  selectedItems: string[];
  toggleSelectItem: (id: string) => void;
  onEdit: (p: Partner) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  renderBulkActionsBar: () => React.ReactNode;
  AddButton: React.ComponentType<{ label: string; onClick: () => void }>;
}

export default function PartnersTab({
  partners,
  selectedItems,
  toggleSelectItem,
  onEdit,
  onDelete,
  onAdd,
  renderBulkActionsBar,
  AddButton,
}: PartnersTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-900">Partners & Clients</h3>
        <AddButton label="Add Partner" onClick={onAdd} />
      </div>
      {renderBulkActionsBar()}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {partners.map((p: Partner) => (
          <div
            key={p._id}
            className={`p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center group relative ${
              selectedItems.includes(p._id as string)
                ? "ring-2 ring-primary border-transparent"
                : ""
            }`}
          >
            <div className="absolute top-2 left-2 z-20">
              <input
                type="checkbox"
                checked={selectedItems.includes(p._id as string)}
                onChange={() => toggleSelectItem(p._id as string)}
                className="checkbox checkbox-primary checkbox-sm bg-white rounded-lg shadow-sm cursor-pointer"
              />
            </div>
            <img
              src={p.logo}
              className="h-12 w-auto object-contain"
              alt={p.name || ""}
            />
            <p className="text-xs font-black text-slate-900 mt-4 tracking-tighter">
              {p.name || ""}
            </p>
            <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(p)}
                className="p-1.5 hover:bg-white rounded-lg text-blue-500"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => onDelete(p._id as string)}
                className="p-1.5 hover:bg-white rounded-lg text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
