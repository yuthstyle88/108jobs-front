export interface JobPost {
  id: string;
  job_title: string;
  description: string;
  is_english_required: boolean;
  example_url: string;
  budget: string;
  deadline: string;
  is_anonymous_post: boolean;
  service_catalog_id: string;
  working_from: string;
  intended_use: string;
  created_at: string;
  updated_at: string;
}

export interface Creator {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
}

export interface JobPostDetail {
  job_post: JobPost;
  category_name: string;
  creator: Creator;
}
