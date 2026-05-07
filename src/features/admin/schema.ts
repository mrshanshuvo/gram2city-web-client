import { z } from "zod";

export const financialSettingsSchema = z.object({
  base_delivery_fee: z.coerce.number().min(0, "Fee cannot be negative"),
  cost_per_kg: z.coerce.number().min(0, "Cost cannot be negative"),
  rider_commission_percentage: z.coerce
    .number()
    .min(0, "Commission cannot be negative")
    .max(100, "Commission cannot exceed 100%"),
});

export type FinancialSettingsFormValues = z.infer<typeof financialSettingsSchema>;
