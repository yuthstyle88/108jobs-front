import { LanguageFile } from "@/constants/language";
import {
  GlobalLanguage,
  LoginLanguage,
  HomeLanguage,
  ProfileCoinLanguage,
  ProfileBasicInfoLanguage,
  ProfileCompanyInfoLanguage,
  ProfileIndividualLanguage,
  ProfileContactInfoLanguage,
  ProfileChatLanguage,
  ProfileApplyLanguage,
  ProfileCouponLanguage,
  ProfileConsentLanguage,
  ProfileJobBoardLanguage,
  ProfileRewardLanguage,
  ProfileNavbarAccountLanguage,
  NotFoundPageLanguage,
  ErrorPageLanguage,
} from "@/types/language";
import { create } from "zustand";

// Raw JSON từ mỗi file
export type LanguageDataType = Partial<
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
  NotFoundPageLanguage &
  ErrorPageLanguage
>;

// Mỗi file lưu ngôn ngữ hiện tại + data
type LanguageStoreData = {
  data: LanguageDataType;
  lang: string;
};

type LanguageData = {
  [key in LanguageFile]?: LanguageStoreData;
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
