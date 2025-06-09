export interface Review {
  id: string;
  profile_id: string;
  reviewer_id: string;
  content: string;
  rating: number;
  created_at: string; 
  reviewer_name: string;
  reviewer_avatar: string;
  is_owner:string;
}

export interface ReviewResponse {
  reviews: Review[];
  total: number;
  average_rating: number;
}
