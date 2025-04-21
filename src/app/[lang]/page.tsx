"use client";

import Loading from "@/components/Loading";
import NotFound from "@/app/not-found";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LanguageRedirect() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { setLang } = useLanguage();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    const lang = params?.lang as string;
    const validLangs = ["vi", "en", "th"];
    const validRoutes = ["/login", "/register", "/profile"];

    if (validLangs.includes(lang)) {
      if (pathname === `/${lang}`) {
        setLang(lang);
        setIsRedirecting(true);
        router.push("/", { scroll: false });
      } else if (
        validRoutes.some((route) => pathname.startsWith(`/${lang}${route}`))
      ) {
        setLang(lang);
      } else {
        setShowNotFound(true);
      }
    } else {
      setShowNotFound(true);
    }
  }, [params, pathname, router, setLang]);

  if (isRedirecting) return <Loading />;
  if (showNotFound) return <NotFound />;

  return null;
}
