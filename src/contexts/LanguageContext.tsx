"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const VALID_LANGUAGES = ["th", "vi", "en"];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("th");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && VALID_LANGUAGES.includes(savedLang)) {
      setLang(savedLang);
    } else {
      localStorage.setItem("lang", "th"); 
    }
  }, []);

  const changeLang = (newLang: string) => {
    if (VALID_LANGUAGES.includes(newLang)) {
      setLang(newLang);
      localStorage.setItem("lang", newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
