"use client";
import { createContext, useContext } from "react";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";
import { ProfileChatLanguage } from "@/types/language";
import Loading from "@/components/Loading";

type LanguageContextType = {
  languageData: Partial<ProfileChatLanguage> | null | undefined;
  isLoading: boolean;
  error: unknown;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const ChatLanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    data: languageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.CHAT);

  if (isLoading) return <Loading/>;
  if (error) return <p>Error loading data.</p>;

  return (
    <LanguageContext.Provider value={{ languageData, isLoading, error }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useChatLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
