"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Loading from "@/components/Loading";

export default function LanguageRedirect() {
  const router = useRouter();
  const params = useParams(); 
  const { setLang } = useLanguage();

  useEffect(() => {
    const lang = params?.lang as string; 
    const validLangs = ["vi", "en", "th"];

    if (validLangs.includes(lang)) {
      setLang(lang);
      router.push("/", { scroll: false }); 
    } else {
      router.push("/", { scroll: false });
    }
  }, [params, router, setLang]);

  return <Loading/>;
}
