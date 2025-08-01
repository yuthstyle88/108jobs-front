"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { VALID_LANGUAGES } from "@/constants/language";
import { I18NextService } from "@/services/I18NextService";
import { I18nextProvider } from "react-i18next";

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLang: string;
}

export function LanguageProvider({
  children,
  initialLang,
}: LanguageProviderProps) {
  const [lang, setLangState] = useState<string>(initialLang); // ใช้ค่าที่ส่งมา

  useEffect(() => {
    if (lang) {
      I18NextService.i18n.changeLanguage(lang);
    }
  }, [lang]);

  const setLang = (newLang: string) => {
    if (!VALID_LANGUAGES.includes(newLang)) return;
    localStorage.setItem("lang", newLang);
    document.cookie = `current-language=${newLang}; path=/`;

    const cleanPath = window.location.pathname.replace(/^\/(vi|en|th)/, "");
    window.location.pathname = `/${newLang}${cleanPath}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <I18nextProvider i18n={I18NextService.i18n} key={lang}>
        {children}
      </I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}