"use client";

import { Wand2, Trash2, Loader2 } from "lucide-react";
import { Avatar } from "@/features/landing/types";

interface AvatarsTabProps {
  avatars: Avatar[];
  selectedItems: string[];
  toggleSelectItem: (id: string) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  isBulkDeleting: boolean;
  onMagicGenerate: () => void;
  generatePending: boolean;
}

export default function AvatarsTab({
  avatars,
  selectedItems,
  toggleSelectItem,
  onDelete,
  onBulkDelete,
  isBulkDeleting,
  onMagicGenerate,
  generatePending,
}: AvatarsTabProps) {
  const avatarIds = avatars.map((a) => a._id);
  const selectedCount = selectedItems.filter((id) => avatarIds.includes(id)).length;
  const allSelected = avatars.length > 0 && selectedCount === avatars.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      avatarIds.forEach((id) => {
        if (selectedItems.includes(id)) toggleSelectItem(id);
      });
    } else {
      avatarIds.forEach((id) => {
        if (!selectedItems.includes(id)) toggleSelectItem(id);
      });
    }
  };

  const handleBulkDelete = () => {
    const toDelete = selectedItems.filter((id) => avatarIds.includes(id));
    if (!toDelete.length) return;
    onBulkDelete(toDelete);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        {/* Left: select-all + count */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected; }}
            onChange={handleSelectAll}
            className="checkbox checkbox-primary checkbox-sm rounded-lg"
          />
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
            {selectedCount} / {avatars.length} Selected
          </span>
        </div>

        {/* Right: bulk delete + magic generate */}
        <div className="flex items-center gap-3">
          {selectedCount > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="btn btn-sm bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl gap-2 shadow-md border-none"
            >
              {isBulkDeleting ? (
                <><Loader2 size={14} className="animate-spin" /> Deleting...</>
              ) : (
                <><Trash2 size={14} /> Delete Selected ({selectedCount})</>
              )}
            </button>
          )}
          <button
            onClick={onMagicGenerate}
            disabled={generatePending}
            className="btn bg-accent hover:bg-[#EBC00D] text-slate-900 rounded-2xl font-black gap-2"
          >
            <Wand2 size={20} />{" "}
            {generatePending ? "Generating..." : "Magic Generate"}
          </button>
        </div>
      </div>

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
