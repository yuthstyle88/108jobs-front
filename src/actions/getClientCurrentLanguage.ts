'use client'
import {LANGUAGES, VALID_LANGUAGES, LANGUAGE_COOKIE} from "@/constants/language";
import {SupportedLang} from "@/lib/metadata";

export async function getClientCurrentLanguage(): Promise<SupportedLang | null> {
  if (typeof window !== "undefined") {
    // ฝั่ง Client
    const cookieString = document.cookie; // อ่านคุกกี้ทั้งหมดในฝั่งลูกข่าย
    const cookieObj = Object.fromEntries(
      cookieString.split("; ").map((cookie) => {
        const [key, value] = cookie.split("=");
        return [key, decodeURIComponent(value)];
      })
    );
    const lang = cookieObj[LANGUAGE_COOKIE]; // ดึงค่าคุกกี้ language
    return lang && VALID_LANGUAGES.includes(lang) ? (lang as SupportedLang) : null;
  }
  return null;
}

export function getNumericCode(langCode: string): number | null {
  const language = LANGUAGES[langCode as keyof typeof LANGUAGES];
  return language && "numericCode" in language ? language.numericCode : null;
}
