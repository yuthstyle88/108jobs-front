// hooks/translation/useTranslateFile.ts
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageFile } from "@/constants/language";
import { LanguageDataType } from "@/store/useLanguageStore";

export const useTranslateFile = (file: LanguageFile): LanguageDataType | undefined => {
  const { languageData } = useLanguageStore();
  return languageData?.[file]?.data;
};
