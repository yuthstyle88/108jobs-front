import {LanguageProvider} from "@/contexts/LanguageContext";
import {generateLocalizedMetadata} from "@/lib/metadata";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import "../globals.css";
import {VALID_LANGUAGES} from "@/constants/language";


export async function generateMetadata({
  params,
}: {
  params: Promise<{lang: string}>;
}): Promise<Metadata> {
  const {lang} = await params;
  return generateLocalizedMetadata("home",
    {lang});
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{lang: string}>;
}) {
  const {lang} = await params;

  if (!VALID_LANGUAGES.includes(lang)) {
    notFound();
  }

  return <LanguageProvider initialLang={lang}>{children}</LanguageProvider>;
}