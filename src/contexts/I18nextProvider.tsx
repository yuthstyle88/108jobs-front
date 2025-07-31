"use client";
import {I18nextProvider} from "react-i18next";
import {I18NextService} from "@/services/I18NextService";
import {useEffect, useState} from "react";
import {useAuthInfo} from "@/hooks/authenticate-api/useAuthInfo";

export default function AppProvider({children}: {children: React.ReactNode}) {
  const {lang} = useAuthInfo();
  const currentLang = lang || "th";
  const [ready, setReady] = useState(false);

  useEffect(() => {
      const i18n = I18NextService.i18n;
      i18n.changeLanguage(currentLang).then(() => setReady(true));
    },
    [currentLang]);

  if (!ready) return null; // hoặc loader

  return (
    <I18nextProvider i18n={I18NextService.i18n}>
      {children}
    </I18nextProvider>
  );
}
