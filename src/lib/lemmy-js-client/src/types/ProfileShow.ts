import {RoleType} from "./RoleType";
import {Service} from "../../../../types/service";
import {User} from "../../../../types/freelancerPofile";
import {Education} from "./Education";
import {WorkExperience} from "./WorkExperience";
import {Skill} from "./Skill";
import {LanguageSkill} from "./LanguageSkill";
import {Certificate,} from "./Certificate";
import {Review} from "./Review";

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