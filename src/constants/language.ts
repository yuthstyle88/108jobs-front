import en from "@/assets/icons/en.svg";
import th from "@/assets/icons/th.svg";
import vn from "@/assets/icons/vn.svg";
export enum LanguageFile {
  GLOBAL = "global",
  AUTHEN = "authen",
  HOME = "home",
  COINS = "profile_coins",
  BASIC_INFO = "profile_info",
  CONTACT = "profile_contact",
  INDIVIDUAL = "profile_individual",
  COMPANY = "profile_company",
  CHAT = "profile_chat",
  APPLY_FREELANCER = "profile_apply",
  COUPON = "profile_coupon",
  CONSENT = "profile_data",
  JOB_BOARD = "profile_job",
  REWARD = "profile_point",
  ACCOUNT_NAVBAR = "profile_navbar",
  ERROR = "error",
  NOT_FOUND = "not_found",
}

export const LANGUAGES = {
  th: { code: "th", label: "Thailand", flag: th },
  en: { code: "en", label: "English", flag: en },
  vi: { code: "vi", label: "Vietnam", flag: vn },
};
