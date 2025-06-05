export type JobDetailResponse = {
  id: string;
  user: User;
  service_catalog: ServiceCatalog;
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
  packages: Package[];
  images: JobImage[];
  worksteps: Workstep[];
  onboarding: Onboarding;
  created_at: string;
  updated_at: string;
  tag_ids: string[];
  completion_rate: number;
  badges: Badge[];
  overall_rating: OverallRating;
  rehire_orders_count: number;
  additional_attributes: AdditionalAttributes;
  socials: SocialLink[];
  websites: WebsiteLink[];
  related_jobs: RelatedJob[];
};

export type User = {
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  user_id: string;
};

export type ServiceCatalog = {
  id: string;
  title: string;
  second_title: string | null;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  service_topic: string | null;
  image_url: string | null;
  is_popular: boolean;
  slug: string;
};

export type ServiceType = ServiceCatalog;

export type Package = {
  id: string;
  job_id: string;
  description: string;
  price: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  package_name: string;
  execution_time: number;
};

export type JobImage = {
  id: string;
  job_id: string;
  image_url: string;
  is_cover_photo: boolean;
  sort_order: number;
  alt: string | null;
  created_at: string;
  updated_at: string;
};

export type Workstep = {
  id: string;
  job_id: string;
  description: string;
  sort_order: number;
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

export type Badge = {
  id: string;
  name: string;
};

export type OverallRating = {
  overall_rating: number;
  average_responsiveness_rating: number;
  average_service_rating: number;
  average_skill_rating: number;
  average_worth_rating: number;
};

export type AdditionalAttributes = {
  certificate_badge: boolean;
  rehire_guarantee_badge: boolean;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

export type WebsiteLink = {
  id: string;
  url: string;
};

export type RelatedJob = {
  id: string;
  title: string;
  slug: string;
};
