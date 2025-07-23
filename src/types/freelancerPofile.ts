import { Service } from "./service";
import {RoleType} from "lemmy-js-client";

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
  profileId: string;
  levelId: string;
  skillName: string;
  createdAt: string;
  updatedAt: string;
  levelName: string;
}
export interface Education {
  id: string;
  schoolName: string;
  major: string;
}
export interface LanguageSkill {
  id: string;
  lang: string;
  levelId: string;
  levelName: string;
}
export interface Certificate {
  id: string;
  name: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startMonth: Month;
  startYear: number;
  isCurrent: boolean;
  endMonth: Month | null;
  endYear: number | null;
}

export interface ProfileShow {
  username: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  memberSince: string;
  education: Education[];
  workExperience: WorkExperience[];
  skill: Skill[];
  language: LanguageSkill[];
  certAndAward: Certificate[];
  roles: RoleType;
  services: Service[];
  ratings: number;
  userId: string;
  reviews:Review[];
  user: User;
}

export interface Review {
  id: string;
  profileId: string;
  reviewerId: string;
  content: string;
  rating: number;
  createdAt: string; 
  reviewerName: string;
  reviewerAvatar: string;
  isOwner:string;
}

export interface User{
  user: UserInfo;
}
export interface UserInfo{
  available: boolean;
}