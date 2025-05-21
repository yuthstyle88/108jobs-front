"use server";

import { cookies } from "next/headers";

export async function getCurrentLanguage(): Promise<"th" | "vi" | "en" | null> {
  const cookieStore = await cookies();

  const lang = cookieStore.get("current-language")?.value;

  const validLangs = ["th", "vi", "en"];

  if (lang && validLangs.includes(lang)) {
    return lang as "th" | "vi" | "en";
  }

  return null;
}
