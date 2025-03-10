import { create } from "zustand";
import { GlobalLanguage } from "@/types/language";

interface LanguageState {
  languageData: GlobalLanguage | null;
  setLanguageData: (data: GlobalLanguage) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    languageData: {} as GlobalLanguage,
  setLanguageData: (data) => set({ languageData: data }),
}));
