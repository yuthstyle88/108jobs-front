import {Education, LanguageSkill, Skill, WorkExperience, Certificate, Service, Review, ProfileData} from "lemmy-js-client";

type ExtraProfileFields = {
  educations?: (Education | string)[];   // บางเวอร์ชันส่งเป็น string[]
  workExperience?: WorkExperience[];
  skill?: Skill[];
  language?: LanguageSkill[];
  certAndAward?: Certificate[];
  services?: Service[];
  reviews?: Review[];
};

export function getProfileData(profileData: ProfileData) {
  const profile = profileData?.profile as Partial<ExtraProfileFields> | undefined;
  const educations: Education[] = (profile?.educations ?? []) as Education[];
  const workExperience: WorkExperience[] = profile?.workExperience ?? [];
  const skill: Skill[] = profile?.skill ?? [];
  const language: LanguageSkill[] = profile?.language ?? [];
  const certAndAward: Certificate[] = profile?.certAndAward ?? [];
  const services: Service[] = profile?.services ?? [];
  const reviews: Review[] = profile?.reviews ?? [];

  // คืนค่า object รวมข้อมูลทั้งหมด
  return {
    educations,
    workExperience,
    skill,
    language,
    certAndAward,
    services,
    reviews,
  };
}
