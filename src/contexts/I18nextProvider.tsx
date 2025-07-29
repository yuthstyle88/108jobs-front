"use client";

import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import { I18NextService } from "@/services/I18NextService";
import { useEffect } from "react";
import {useAuthInfo} from "@/hooks/authenticate-api/useAuthInfo";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useAuthInfo()
  const currentLang = lang || "en";

  useEffect(() => {
    if (I18NextService.i18n.language !== currentLang) {
      I18NextService.i18n.changeLanguage(currentLang);
    }
  }, [currentLang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default AppProvider;