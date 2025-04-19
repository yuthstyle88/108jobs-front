export type FreelancerFormData = {
  sourceTypes: string[];
  avatar_url: string | null;
  username: string;
  display_name: string;
  bio: string;
  freelancer_type: "Parttime" | "Fulltime";
  apply_fee: boolean;
  birth_date: string;
  email: string;
  countryType: "Thailand" | "Foreign";
  country: string;

  card_number: string;
  card_address_details: string;
  card_zip_code: string;
  card_subdistrict_or_district: string;
  card_district_or_subdistrict: string;
  card_province: string;

  front_card: string | null;
  back_card: string | null;
  title: string;
  name: string;
  surname: string;
  address_details: string;
  province: string;
  subdistrict_or_district: string;
  district_or_subdistrict: string;
  zip_code: string;
};
