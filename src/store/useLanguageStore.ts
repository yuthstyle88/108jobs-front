import { LanguageFile } from "@/constants/language";
import {
  ErrorPageLanguage,
  GlobalLanguage,
  HomeLanguage,
  LoginLanguage,
  NotFoundPageLanguage,
  ProfileApplyLanguage,
  ProfileBasicInfoLanguage,
  ProfileCoinLanguage,
  ProfileCompanyInfoLanguage,
  ProfileConsentLanguage,
  ProfileContactInfoLanguage,
  ProfileCouponLanguage,
  ProfileIndividualLanguage,
  ProfileJobBoardLanguage,
  ProfileNavbarAccountLanguage,
  ProfileChatLanguage,
  ProfileRewardLanguage
} from "@/types/language";
import { create } from "zustand";

type LanguageData = {
  [key in LanguageFile]?: Partial<
    GlobalLanguage &
      LoginLanguage &
      HomeLanguage &
      ProfileCoinLanguage &
      ProfileBasicInfoLanguage &
      ProfileCompanyInfoLanguage &
      ProfileIndividualLanguage &
      ProfileContactInfoLanguage &
      ProfileChatLanguage &
      ProfileApplyLanguage &
      ProfileCouponLanguage &
      ProfileConsentLanguage &
      ProfileJobBoardLanguage &
      ProfileRewardLanguage &
      ProfileNavbarAccountLanguage & 
      ErrorPageLanguage &
      NotFoundPageLanguage
  >;
};

type LanguageStore = {
  languageData: LanguageData;
  setLanguageData: (
    data: LanguageData | ((prevData: LanguageData) => LanguageData)
  ) => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  languageData: {},
  setLanguageData: (data) =>
    set((state) => ({
      languageData:
        typeof data === "function"
          ? data(state.languageData || {})
          : { ...state.languageData, ...data },
    })),
}));
