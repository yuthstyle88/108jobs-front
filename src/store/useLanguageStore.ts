import { LanguageFile } from "@/constants/language";
import {
  GlobalLanguage,
  HomeLanguage,
  LoginLanguage,
  ProfileApplyLanguage,
  ProfileBasicInfoLanguage,
  ProfileCoinLanguage,
  ProfileCompanyInfoLanguage,
  ProfileConsentLanguage,
  ProfileContactInfoLanguage,
  ProfileCouponLanguage,
  ProfileIndividualLanguage,
  ProfileJobBoardLanguage,
  ProfileProfileChatLanguage,
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
      ProfileProfileChatLanguage &
      ProfileApplyLanguage &
      ProfileCouponLanguage &
      ProfileConsentLanguage &
      ProfileJobBoardLanguage &
      ProfileRewardLanguage
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
