export type Address = {
  id: string;
  country: string;
  province: string | null;
  districtOrSubdistrict: string | null;
  subdistrictOrDistrict: string | null;
  addressDetails: string | null;
  zipCode: string | null;
  createdAt: string;
  updatedAt: string;
};