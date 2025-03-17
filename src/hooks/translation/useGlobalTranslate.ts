"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicFetch } from "../api-hooks";
import { useLanguageStore } from "@/store/useLanguageStore";
import { GlobalLanguage, HomeLanguage, LoginLanguage } from "@/types/language";
import { useEffect } from "react";

export const useGlobalTranslate = (file: "global" | "authen" | "home") => {
  const { setGlobalLanguageData, setLoginLanguageData, setHomeLanguageData } =
    useLanguageStore();
  const { lang } = useLanguage();
  const path = `/lang/${lang}/${file}_${lang}.json`;

  const { data, error, isLoading } = usePublicFetch<
    GlobalLanguage | LoginLanguage | HomeLanguage
  >(path);

  useEffect(() => {
    if (data) {
      if (file === "global") {
        setGlobalLanguageData(data as GlobalLanguage);
      } else if (file === "authen") {
        setLoginLanguageData(data as LoginLanguage);
      } else if (file === "home") {
        setHomeLanguageData(data as HomeLanguage);
      }
    }
  }, [
    data,
    file,
    setGlobalLanguageData,
    setLoginLanguageData,
    setHomeLanguageData,
  ]);

  return { data, error, isLoading };
};
