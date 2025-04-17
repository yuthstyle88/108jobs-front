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

export interface Skill {
  id: string;
  profile_id: string;
  level_id: string;
  skill_name: string;
  created_at: string;
  updated_at: string;
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
  is_verified: boolean;
  member_since: string;
  education: Education[];
  work_experience: WorkExperience[];
  skill: Skill[];
  language: LanguageSkill[];
  cert_and_award: Certificate[];
}
