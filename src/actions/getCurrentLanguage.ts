"use server";

import { cookies } from "next/headers";

export async function getCurrentLanguage(): Promise<"th" | "vi" | "en" | null> {
  // ฝั่ง Server
  const cookieStore = cookies(); // API ของ Next.js สำหรับ Server-side
  const cookieData = await cookieStore;
  const lang = cookieData.get("current-language")?.value;
  const validLangs = ["th", "vi", "en"];
  return lang && validLangs.includes(lang) ? (lang as "th" | "vi" | "en") : null;
}
