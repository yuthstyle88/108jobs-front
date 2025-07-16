// utils/validation/addressSchema.ts
import { z } from "zod";

export const addressSchema = z
  .object({
    country: z.string(),
    province: z.string().optional(),
    districtOrSubdistrict: z.string().optional(),
    subdistrictOrDistrict: z.string().optional(),
    zipCode: z.string().optional(),
    addressDetails: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.country === "Thailand") {
      if (!data.province?.trim()) {
        ctx.addIssue({ code: "custom", path: ["province"], message: "กรุณาระบุจังหวัด" });
      }
      if (!data.districtOrSubdistrict?.trim()) {
        ctx.addIssue({ code: "custom", path: ["districtOrSubdistrict"], message: "กรุณาระบุอำเภอ/เขต" });
      }
      if (!data.subdistrictOrDistrict?.trim()) {
        ctx.addIssue({ code: "custom", path: ["subdistrictOrDistrict"], message: "กรุณาระบุตำบล/แขวง" });
      }
      if (!data.zipCode?.trim()) {
        ctx.addIssue({ code: "custom", path: ["zipCode"], message: "กรุณาระบุรหัสไปรษณีย์" });
      }
      if (!data.addressDetails?.trim()) {
        ctx.addIssue({ code: "custom", path: ["addressDetails"], message: "กรุณาระบุรายละเอียดที่อยู่" });
      }
    } else {
      if (!data.country?.trim() || data.country === "Foreign") {
        ctx.addIssue({ code: "custom", path: ["country"], message: "กรุณาเลือกประเทศ" });
      }
    }
  });

export type AddressFormData = z.infer<typeof addressSchema>;
