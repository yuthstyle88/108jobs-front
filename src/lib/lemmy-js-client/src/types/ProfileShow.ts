import {RoleType} from "./RoleType";
import {Education} from "./Education";
import {WorkExperience} from "./WorkExperience";
import {Skill} from "./Skill";
import {LanguageSkill} from "./LanguageSkill";
import {Certificate,} from "./Certificate";
import {Review} from "./Review";
import {Service} from "./Service";

export type ProfileShow = {
  username: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  memberSince: string;
  education: Array<Education>;
  workExperience: Array<WorkExperience>;
  skill: Array<Skill>;
  language: Array<LanguageSkill>;
  certAndAward: Array<Certificate>;
  roles: RoleType;
  services: Array<Service>;
  ratings: number;
  userId: string;
  reviews:Array<Review>;
}