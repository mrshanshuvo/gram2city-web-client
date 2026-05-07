import { z } from "zod";

export const parcelSchema = z.object({
  parcelType: z.enum(["Document", "Not-Document"]),
  weight: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Weight must be a positive number",
    }),
  parcelName: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description too long"),

  // Sender Details
  senderName: z.string().min(2, "Name is too short"),
  senderContact: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  senderRegion: z.string().min(1, "Region is required"),
  senderDistrict: z.string().min(1, "District is required"),
  senderServiceCenter: z.string().min(1, "Hub is required"),
  senderAddress: z.string().min(5, "Address is too short"),
  pickupInstruction: z.string().optional(),

  // Receiver Details
  receiverName: z.string().min(2, "Name is too short"),
  receiverContact: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  receiverRegion: z.string().min(1, "Region is required"),
  receiverDistrict: z.string().min(1, "District is required"),
  receiverServiceCenter: z.string().min(1, "Hub is required"),
  deliveryAddress: z.string().min(5, "Address is too short"),
  deliveryInstruction: z.string().optional(),
});

export type ParcelFormValues = z.infer<typeof parcelSchema>;
