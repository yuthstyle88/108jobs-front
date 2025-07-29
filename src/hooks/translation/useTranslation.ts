import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type ErrorMessages = Record<string, string>;

const translationCache: Record<string, ErrorMessages> = {}; // Cache ข้อความแปล

export const useTranslation = () => {
  const { lang } = useLanguage(); // ดึงภาษาปัจจุบัน
  const [translations, setTranslations] = useState<ErrorMessages>({}); // เก็บข้อความแปล
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);

      if (translationCache[lang]) {
        // ใช้ Cache หากมีอยู่แล้ว
        setTranslations(translationCache[lang]);
        setIsLoading(false);
        return;
      }

      try {
        // โหลดข้อความแปลตามภาษา
        const importedTranslations: ErrorMessages = await import(
          `../locales/errorConstants.${lang}.json`
        );
        translationCache[lang] = importedTranslations; // เก็บข้อความแปลลง Cache
        setTranslations(importedTranslations);
      } catch (error) {
        console.error(`Error loading translations for lang: ${lang}`, error);
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [lang]);

  const t = (key: string) => translations[key] || key; // คืนค่าข้อความ หรือใช้ key หากไม่พบ

  return { t, isLoading };
};