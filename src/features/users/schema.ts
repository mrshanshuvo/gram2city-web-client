import { z } from "zod";

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z
    .string()
    .min(5, "Feedback must be at least 5 characters")
    .max(500, "Feedback too long"),
  category: z.enum(["service", "app", "rider", "other"]),
});

export const riderApplicationSchema = z.object({
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  nid: z.string().regex(/^(?:\d{10}|\d{13}|\d{17})$/, "NID must be 10, 13 or 17 digits"),
  age: z.number().min(18, "Must be at least 18").max(70, "Must be under 70"),
  bikeBrand: z.string().min(2, "Brand name too short"),
  bikeRegNo: z.string().min(5, "Invalid registration number"),
  region: z.string().min(1, "Region is required"),
  district: z.string().min(1, "District is required"),
  additionalInfo: z.string().optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
export type RiderApplicationFormValues = z.infer<typeof riderApplicationSchema>;
