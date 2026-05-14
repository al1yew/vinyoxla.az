import { z } from "zod";

export const vinSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/));

export const phoneSchema = z
  .string()
  .regex(/^(10|50|51|55|60|70|77|99)\d{7}$/);

export const otpSchema = z.string().regex(/^\d{4}$/);

export const checkoutSelectionSchema = z.object({
  vin: vinSchema,
  products: z.array(z.enum(["carfax", "autocheck"])).min(1).max(2)
});

export const topUpAmountSchema = z.number().min(1).max(1000);

export const reportFiltersSchema = z.object({
  vin: z.string().optional(),
  type: z.enum(["all", "carfax", "autocheck"]).default("all"),
  status: z.enum(["all", "success", "failed", "pending"]).default("all"),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(["date", "vin", "type"]).default("date"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  pageSize: z.union([
    z.literal(25),
    z.literal(50),
    z.literal(75),
    z.literal(100),
    z.literal(200)
  ]).default(25)
});

export const reviewSchema = z.object({
  name: z.string().trim().min(2).max(70),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(600)
});

export type VinInput = z.infer<typeof vinSchema>;
export type CheckoutSelectionInput = z.infer<typeof checkoutSelectionSchema>;
export type ReportFiltersInput = z.infer<typeof reportFiltersSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
