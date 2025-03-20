import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicFetch } from "../api-hooks";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useEffect } from "react";
import { LanguageDataType } from "@/types/language";
import { LanguageFile } from "@/constants/language";

export const useGlobalTranslate = (file: LanguageFile) => {
  const { languageData, setLanguageData } = useLanguageStore();
  const { lang } = useLanguage();
  const path = `/lang/${lang}/${file}_${lang}.json`;

  const cachedData = languageData?.[file];

  const { data, error, isLoading } = usePublicFetch<LanguageDataType>(
    cachedData ? null : path
  );

  useEffect(() => {
    if (data) {
      setLanguageData((prevData) => ({
        ...prevData,
        [file]: data,
      }));
    }
  }, [data, file, setLanguageData]);

  return { data: cachedData || data, error, isLoading };
};
