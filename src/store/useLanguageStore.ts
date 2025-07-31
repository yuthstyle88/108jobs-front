import {LanguageFile} from "@/constants/language";
import {create} from "zustand";

type LanguageStoreData = {
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
          : {...state.languageData, ...data},
    })),
}));
