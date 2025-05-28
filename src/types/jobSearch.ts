export type JobList = {
  jobs: Job[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
  service_categories: ServiceCategory[];
  tag: string;
};

export type Job = {
  id: string;
  user: User;
  service_type: ServiceType;
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
};

export type User = {
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
};

export type ServiceType = {
  id: string;
  title: string;
  second_title: string;
  created_at: string;
  updated_at: string;
  parent_id: string;
  service_topic: string;
  image_url: string | null;
  is_popular: boolean;
};

export type Onboarding = {
  id: string;
  job_id: string;
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
};

export type ServiceCategory = {
  id: string;
  title: string;
  second_title: string | null;
  parent_id: string | null;
  service_topic: string | null;
  image_url: string | null;
  jobs_count: number;
};
