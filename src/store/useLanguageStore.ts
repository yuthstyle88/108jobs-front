import { create } from "zustand";
import {
  GlobalLanguage,
  HomeLanguage,
  LoginLanguage,
  ProfileBasicInfoLanguage,
  ProfileCoinLanguage,
  ProfileCompanyInfoLanguage,
  ProfileContactInfoLanguage,
  ProfileIndividualLanguage,
  ProfileProfileChatLanguage,
} from "@/types/language";
import { LanguageFile } from "@/constants/language";


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
      ProfileProfileChatLanguage
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
