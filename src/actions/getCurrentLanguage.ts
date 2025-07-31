"use server";

import {cookies} from "next/headers";
import {VALID_LANGUAGES} from "@/constants/language";
import {SupportedLang} from "@/lib/metadata";

export async function getCurrentLanguage(): Promise<SupportedLang | null> {
  // ฝั่ง Server
  const cookieStore = cookies(); // API ของ Next.js สำหรับ Server-side
  const cookieData = await cookieStore;
  const lang = cookieData.get("current-language")?.value;

  return lang && VALID_LANGUAGES.includes(lang) ? (lang as SupportedLang) : null;
}
