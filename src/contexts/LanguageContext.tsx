'use client';
import { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("th");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const changeLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
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
