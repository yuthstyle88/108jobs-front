"use client";
import { createContext, useContext } from "react";
import {VALID_LANGUAGES} from "@/constants/language";

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
}


const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  initialLang = "th",
}: {
  children: React.ReactNode;
  initialLang?: string;
}) {
  const lang = initialLang;

  const setLang = (newLang: string) => {
    if (!VALID_LANGUAGES.includes(newLang)) return;

    localStorage.setItem("lang", newLang);
    document.cookie = `current-language=${newLang}; path=/`;

    const cleanPath = window.location.pathname.replace(/^\/(vi|en|th)/, "");
    const isLocalhost = window.location.hostname === "localhost";

    if (isLocalhost) {
      window.location.pathname = `/${newLang}${cleanPath}`;
    } else {
      window.location.pathname = `/${newLang}${cleanPath}`;
      // window.location.href = `https://${newLang}.test-fastwork.vercel.app/${newLang}${cleanPath}`;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
