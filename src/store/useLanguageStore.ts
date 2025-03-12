import { create } from "zustand";
import { GlobalLanguage, HomeLanguage, LoginLanguage } from "@/types/language";

interface LanguageState {
  globalLanguageData: GlobalLanguage | null;
  loginLanguageData: LoginLanguage | null;
  homeLanguageData: HomeLanguage | null;
  setGlobalLanguageData: (data: GlobalLanguage) => void;
  setLoginLanguageData: (data: LoginLanguage) => void;
  setHomeLanguageData: (data: HomeLanguage) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  globalLanguageData: null,
  loginLanguageData: null,
  homeLanguageData: null,
  setGlobalLanguageData: (data) => set({ globalLanguageData: data }),
  setLoginLanguageData: (data) => set({ loginLanguageData: data }),
  setHomeLanguageData: (data) => set({ homeLanguageData: data }),
}));
