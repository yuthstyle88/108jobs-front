// utils/validation/addressSchema.ts
import { z } from "zod";

export const addressSchema = z
  .object({
    country: z.string(),
    province: z.string().optional(),
    district_or_subdistrict: z.string().optional(),
    subdistrict_or_district: z.string().optional(),
    zip_code: z.string().optional(),
    address_details: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.country === "Thailand") {
      if (!data.province?.trim()) {
        ctx.addIssue({ code: "custom", path: ["province"], message: "กรุณาระบุจังหวัด" });
      }
      if (!data.district_or_subdistrict?.trim()) {
        ctx.addIssue({ code: "custom", path: ["district_or_subdistrict"], message: "กรุณาระบุอำเภอ/เขต" });
      }
      if (!data.subdistrict_or_district?.trim()) {
        ctx.addIssue({ code: "custom", path: ["subdistrict_or_district"], message: "กรุณาระบุตำบล/แขวง" });
      }
      if (!data.zip_code?.trim()) {
        ctx.addIssue({ code: "custom", path: ["zip_code"], message: "กรุณาระบุรหัสไปรษณีย์" });
      }
      if (!data.address_details?.trim()) {
        ctx.addIssue({ code: "custom", path: ["address_details"], message: "กรุณาระบุรายละเอียดที่อยู่" });
      }
    } else {
      if (!data.country?.trim() || data.country === "Foreign") {
        ctx.addIssue({ code: "custom", path: ["country"], message: "กรุณาเลือกประเทศ" });
      }
    }
  });

export type AddressFormData = z.infer<typeof addressSchema>;
