'use client'
import {LANGUAGES} from "@/constants/language";

export async function getClientCurrentLanguage(): Promise<"th" | "vi" | "en" | null> {
  if (typeof window !== "undefined") {
    // ฝั่ง Client
    const cookieString = document.cookie; // อ่านคุกกี้ทั้งหมดในฝั่งลูกข่าย
    const cookieObj = Object.fromEntries(
      cookieString.split("; ").map((cookie) => {
        const [key, value] = cookie.split("=");
        return [key, decodeURIComponent(value)];
      })
    );
    const lang = cookieObj["current-language"]; // ดึงค่าคุกกี้ 'current-language'
    const validLangs = ["th", "vi", "en"];
    return lang && validLangs.includes(lang) ? (lang as "th" | "vi" | "en") : null;
  }
  return null;
}
export function getNumericCode(langCode: string): number | null {
  const language = LANGUAGES[langCode as keyof typeof LANGUAGES];
  return language && "numericCode" in language ? language.numericCode : null;
}
