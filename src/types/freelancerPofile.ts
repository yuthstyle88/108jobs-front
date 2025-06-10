import { Service } from "./service";

export type Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type RoleType = "employer" | "freelancer";

export interface Skill {
  id: string;
  profile_id: string;
  level_id: string;
  skill_name: string;
  created_at: string;
  updated_at: string;
  level_name: string;
}
export interface Education {
  id: string;
  school_name: string;
  major: string;
}
export interface LanguageSkill {
  id: string;
  lang: string;
  level_id: string;
  level_name: string;
}
export interface Certificate {
  id: string;
  name: string;
}

export interface WorkExperience {
  id: string;
  company_name: string;
  position: string;
  start_month: Month;
  start_year: number;
  is_current: boolean;
  end_month: Month | null;
  end_year: number | null;
}

export interface ProfileShow {
  username: string;
  bio: string;
  avatar_url: string;
  is_verified: boolean;
  member_since: string;
  education: Education[];
  work_experience: WorkExperience[];
  skill: Skill[];
  language: LanguageSkill[];
  cert_and_award: Certificate[];
  roles: RoleType[];
  services: Service[];
  ratings: number;
  user_id: string;
  reviews:Review[];
}

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