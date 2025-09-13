"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {LANGUAGE_COOKIE, VALID_LANGUAGES} from "@/constants/language";
import {I18NextService} from "@/services/I18NextService";
import {I18nextProvider} from "react-i18next";

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
  const safeInitial = VALID_LANGUAGES.includes(initialLang) ? initialLang : 'th';
  const [lang, setLangState] = useState<string>(safeInitial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const initI18n = async () => {
      await I18NextService.init();
      if (!cancelled) {
        await I18NextService.i18n.changeLanguage(lang);
        setReady(true);
      }
    };
    initI18n();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const setLang = (newLang: string) => {
    if (!VALID_LANGUAGES.includes(newLang)) return;
    if (typeof document !== 'undefined') {
      document.cookie = `${LANGUAGE_COOKIE}=${newLang}; path=/`;
    }
    setLangState(newLang);

    if (typeof window !== 'undefined') {
      const langsPattern = `(?:${VALID_LANGUAGES.join('|')})`;
      const langPrefixRe = new RegExp(`^/` + langsPattern + `\\b`);
      const currentPath = window.location.pathname;
      const pathWithoutLang = currentPath.replace(langPrefixRe, '') || '/';
      const { search, hash } = window.location;
      window.location.assign(`/${newLang}${pathWithoutLang}${search}${hash}`);
    }
  };

  if (!ready) return null;

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