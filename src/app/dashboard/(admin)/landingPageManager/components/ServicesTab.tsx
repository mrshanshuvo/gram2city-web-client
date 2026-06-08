"use client";

import Image from "next/image";
import { Edit3, Trash2, Zap } from "lucide-react";
import { Service } from "@/features/landing/types";

interface ServicesTabProps {
  services: Service[];
  selectedItems: string[];
  toggleSelectItem: (id: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  renderBulkActionsBar: () => React.ReactNode;
  AddButton: React.ComponentType<{ label: string; onClick: () => void }>;
}

export default function ServicesTab({
  services,
  selectedItems,
  toggleSelectItem,
  onEdit,
  onDelete,
  onAdd,
  renderBulkActionsBar,
  AddButton,
}: ServicesTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-900">Services</h3>
        <AddButton label="Add Service" onClick={onAdd} />
      </div>
      {renderBulkActionsBar()}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service: Service) => (
          <div
            key={service._id}
            className={`p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4 ${
              selectedItems.includes(service._id as string)
                ? "ring-2 ring-primary border-transparent"
                : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(service._id as string)}
                  onChange={() => toggleSelectItem(service._id as string)}
                  className="checkbox checkbox-primary checkbox-sm bg-white rounded-lg shadow-sm cursor-pointer"
                />
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#2E7D32] shadow-sm overflow-hidden p-2">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt=""
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Zap size={24} />
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(service)}
                  className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => onDelete(service._id as string)}
                  className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                {service.title || ""}
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1 line-clamp-2">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
