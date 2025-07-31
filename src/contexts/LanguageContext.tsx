"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {VALID_LANGUAGES} from "@/constants/language";
import {I18NextService} from "@/services/I18NextService";
import {I18nextProvider} from "react-i18next";

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  initialLang = typeof window !== "undefined"
    ? localStorage.getItem("lang") ||
      document.cookie.match(/current-language=(\w+)/)?.[1] ||
      "th"
    : "th",
}: {
  children: React.ReactNode;
  initialLang?: string;
}) {
  const [lang, setLangState] = useState<string>(initialLang);

  useEffect(() => {
    if (lang) {
      I18NextService.i18n.changeLanguage(lang);
    }
  }, [lang]);

  const setLang = (newLang: string) => {
    if (!VALID_LANGUAGES.includes(newLang)) return;
    localStorage.setItem("lang", newLang);
    document.cookie = `current-language=${newLang}; path=/`;

    const cleanPath = window.location.pathname.replace(/^\/(vi|en|th)/,
      "");
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
