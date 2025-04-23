import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicFetch } from "../api-hooks";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useEffect, useMemo } from "react";
import { LanguageFile } from "@/constants/language";
import { LanguageDataType } from "@/store/useLanguageStore";

export const useGlobalTranslate = (file: LanguageFile) => {
  const { languageData, setLanguageData } = useLanguageStore();
  const { lang } = useLanguage();

  const path = useMemo(() => `/lang/${lang}/${file}_${lang}.json`, [lang, file]);

  const cacheEntry = languageData?.[file];
  const isSameLang = cacheEntry?.lang === lang;

  const { data, error, isLoading } = usePublicFetch<LanguageDataType>(
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
