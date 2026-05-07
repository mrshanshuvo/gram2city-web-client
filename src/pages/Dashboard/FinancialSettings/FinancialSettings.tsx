import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { FiSave, FiInfo, FiPercent, FiTruck, FiLayers } from "react-icons/fi";
import SkeletonLoader from "../../Shared/SkeletonLoader/SkeletonLoader";
import { fetchSystemSettings, updateSystemSettings } from "../../../features/admin/api";
import { SystemSettings } from "../../../features/admin/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { financialSettingsSchema, FinancialSettingsFormValues } from "../../../features/admin/schema";

const FinancialSettings: React.FC = () => {

  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch current settings
  const { data, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: () => fetchSystemSettings(),
  });

  const { register, handleSubmit, reset } = useForm<FinancialSettingsFormValues>({
    resolver: zodResolver(financialSettingsSchema) as any,
  });

  useEffect(() => {
    if (data) {
      reset({
        base_delivery_fee: data.base_delivery_fee,
        cost_per_kg: data.cost_per_kg,
        rider_commission_percentage: data.rider_commission_percentage,
      });
    }
  }, [data, reset]);

  // Mutation for updating settings
  const updateSettings = useMutation({
    mutationFn: (newSettings: SystemSettings) => updateSystemSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      toast.success("Financial settings updated successfully!");
      setIsUpdating(false);
    },
    onError: () => {
      toast.error("Failed to update settings. Please try again.");
      setIsUpdating(false);
    }
  });

  const onSubmit = (data: FinancialSettingsFormValues) => {
    setIsUpdating(true);
    updateSettings.mutate(data);
  };

  if (isLoading) return <SkeletonLoader type="table" />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Financial Infrastructure</h2>
        <p className="text-gray-500 font-medium">Configure global pricing, commission models, and revenue splits.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            
            {/* Base Fee */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FiTruck className="text-primary" />
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Base Delivery Fee (৳)</label>
              </div>
              <input
                type="number"
                {...register("base_delivery_fee", { valueAsNumber: true })}
                className="input w-full bg-gray-50 border-none rounded-2xl h-14 font-bold text-lg focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-[10px] text-gray-400 font-medium">The starting price for any delivery under 1kg.</p>
            </div>

            {/* Cost Per KG */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FiLayers className="text-primary" />
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Extra Weight Charge (৳/kg)</label>
              </div>
              <input
                type="number"
                {...register("cost_per_kg", { valueAsNumber: true })}
                className="input w-full bg-gray-50 border-none rounded-2xl h-14 font-bold text-lg focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-[10px] text-gray-400 font-medium">Additional cost applied for each kilogram above the base weight.</p>
            </div>

            {/* Rider Commission */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FiPercent className="text-primary" />
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Rider Earning Percentage (%)</label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  {...register("rider_commission_percentage", { valueAsNumber: true })}
                  className="input w-full bg-gray-50 border-none rounded-2xl h-14 font-bold text-lg focus:ring-2 focus:ring-primary/20 pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Percentage of the total cost that goes directly to the rider. The remaining amount is Admin Profit.</p>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-primary w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-2"
            >
              <FiSave className="text-lg" />
              {isUpdating ? "Updating Infrastructure..." : "Deploy Financial Changes"}
            </button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
            <div className="flex items-center gap-2 text-amber-600 mb-3">
              <FiInfo />
              <span className="text-xs font-black uppercase tracking-widest">Pricing Logic</span>
            </div>
            <div className="space-y-4 text-xs font-medium text-amber-800 leading-relaxed">
              <p>Total Cost = Base Fee + (Weight - 1) × Extra Charge</p>
              <div className="h-px bg-amber-200/50 w-full"></div>
              <p>Rider Earning = Total Cost × {data?.rider_commission_percentage}%</p>
              <p>Admin Revenue = Total Cost - Rider Earning</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <FiInfo />
              <span className="text-xs font-black uppercase tracking-widest">Global Impact</span>
            </div>
            <p className="text-xs font-medium text-blue-800 leading-relaxed">
              Changes applied here will immediately affect all new parcel bookings across the platform. 
              <span className="block mt-2 font-bold">Past bookings will remain unaffected to preserve invoice integrity.</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FinancialSettings;
