export interface Service {
  id: string;
  user_id: string;
  service_type_id: string;
  slug: string;
  title: string;
  base_price: string;
  price_before_discount: string;
  ban_type: string | null;
  banned_at: string | null;
  show: boolean;
  rating: string;
  status: number;
  is_hot: boolean;
  is_pro: boolean;
  description: string;
  ready_to_work_at: string | null;
  is_instant_hire: boolean;
  purchase_count: number;
  reviews_count: number;
  last_approved_at: string | null;
  created_at: string;
  updated_at: string;
}
