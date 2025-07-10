import { LanguageFile } from "@/constants/language";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageDataType, useLanguageStore } from "@/store/useLanguageStore";
import { useEffect, useMemo } from "react";
import { usePublicFetchV2 } from "../api-hooks";

export const useGlobalTranslate = (file: LanguageFile) => {
  const { languageData, setLanguageData } = useLanguageStore();
  const { lang } = useLanguage();

  const path = useMemo(() => `/i18n/${lang}/${file}`, [lang, file]);

  const cacheEntry = languageData?.[file];
  const isSameLang = cacheEntry?.lang === lang;

  const { data, error, isLoading } = usePublicFetchV2<LanguageDataType>(
    isSameLang ? null : path
  );

  useEffect(() => {
    if (data && !isSameLang) {
      setLanguageData((prev) => ({
        ...prev,
        [file]: {
          data,
          lang,
        },
      }));
    }
  }, [data, file, lang, setLanguageData, isSameLang]);

  return {
    data: isSameLang ? cacheEntry?.data : data,
    error,
    isLoading,
  };
};
