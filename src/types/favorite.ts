export type FavoriteJob = {
  jobs: Job[];
  total_count: number;
  success: boolean;
  page: number;
  per_page: number;
};

export type Job = {
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
  created_at: string;
  updated_at: string;
  tag_ids: string[];
  completion_rate: number;
  overall_rating: OverallRating;
  rehire_orders_count: number;
};

export type User = {
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
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
  slug: string;
};

export type OverallRating = {
  overall_rating: number;
  average_responsiveness_rating: number;
  average_service_rating: number;
  average_skill_rating: number;
  average_worth_rating: number;
};
