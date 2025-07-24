import {Service} from "../../../../types/service";
import {Review} from "../../../../types/review";
import {Education} from "./Education";
import {WorkExperience} from "./WorkExperience";
import {Skill} from "./Skill";
import {LanguageSkill} from "./LanguageSkill";
import {Certificate} from "./Certificate";

export type Profile = {
  id: string;
  bio: string | null;
  averageResponseTime: string | null;
  createdAt: string;
  updatedAt: string;
  membershipLevelId: string;
  isVerified: string;
  ratings?: number;
  educations?: Education[];
  workExperience?: WorkExperience[];
  skill?: Skill[];
  language?: LanguageSkill[];
  certAndAward?: Certificate[];
  services?: Service[];
  reviews?: Review[];
};