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

export interface JobPost {
  id: string;
  job_title: string;
  category: string;
  working_from: string;
  intended_use: string;
  budget: string;
  created_at: string;
  deadline: string;
}

export interface JobPostsResponse {
  items: JobPost[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}
