export interface Job {
  id: string;
  user: User;
  slug: string;
  title: string;
  base_price: string;
  price_before_discount: string;
  show: boolean;
  rating: string;
  status: number;
  is_hot: boolean;
  is_pro: boolean;
  description: string;
  is_instant_hire: boolean;
  purchase_count: number;
  reviews_count: number;
  onboarding: Onboarding;
  created_at: string;
  updated_at: string;
  service_catalog: ServiceCatalog;
  service_type: ServiceType;
  packages: Package[];
  images: JobImage[];
  worksteps: WorkStep[];
}

export interface User {
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
}

export interface Onboarding {
  id: string;
  job_id: string;
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
}

export interface ServiceCatalog {
  id: string;
  title: string;
  second_title: string | null;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  service_topic: string | null;
  image_url: string | null;
}

export interface ServiceType {
  id: string;
  title: string;
  second_title: string | null;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  service_topic: string | null;
  image_url: string | null;
}

export interface Package {
  id: string;
  job_id: string;
  description: string;
  price: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  package_name: string;
  execution_time: number;
}

export interface JobImage {
  id: string;
  job_id: string;
  image_url: string;
  is_cover_photo: boolean;
  sort_order: number;
  alt: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkStep {
  id: string;
  job_id: string;
  description: string;
  sort_order: number;
}

export interface JobListResponse {
  jobs: Job[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

export type JobType = Job;
