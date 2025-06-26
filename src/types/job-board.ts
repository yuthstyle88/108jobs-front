export type CreateJobPayload = {
  service_catalog_id: string;
  job_title: string;
  description: string;
  is_english_required: boolean;
  example_url?: string;
  budget: string;
  deadline?: string;
  is_anonymous_post: boolean;
  working_from: "Freelance" | "Contract" | "Parttime" | "Fulltime";
  intended_use: "Business" | "Personal" | "Unknown";
};
