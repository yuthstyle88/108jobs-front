import {Education} from "./Education";
import {WorkExperience} from "./WorkExperience";
import {Skill} from "./Skill";
import {LanguageSkill} from "./LanguageSkill";
import {Certificate} from "./Certificate";
import {Review} from "./Review";
import {Service} from "./Service";

export type Profile = {
  id: string;
  bio: string | null;
  averageResponseTime: string | null;
  createdAt: string;
  updatedAt: string;
  membershipLevelId: string;
  isVerified: string;
  ratings?: number;
  educations?: Array<Education>;
  workExperience?: Array<WorkExperience>;
  skill?: Array<Skill>;
  language?: Array<LanguageSkill>;
  certAndAward?: Array<Certificate>;
  services?: Array<Service>;
  reviews?: Array<Review>;
};