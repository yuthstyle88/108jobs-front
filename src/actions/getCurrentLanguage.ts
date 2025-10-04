"use server";

import {cookies, headers} from "next/headers";
import {LANGUAGE_COOKIE, VALID_LANGUAGES} from "@/constants/language";
import {SupportedLang} from "@/lib/metadata";

export async function getCurrentLanguage(): Promise<SupportedLang> {
  // Server-side: read cookie first
  const cookieStore = cookies();
  const cookieData = await cookieStore;
  const cookieLang = cookieData.get(LANGUAGE_COOKIE)?.value;
  if (cookieLang && VALID_LANGUAGES.includes(cookieLang)) {
    return cookieLang as SupportedLang;
  }

  // Fallback: derive from request path ("browser" URL) when cookie missing/invalid
  // Note: Next.js 13+ exposes the full path via headers like x-invoke-path or x-matched-path in edge/runtime.
  // We'll try pathname from "x-invoke-path" then "x-matched-path", then parse referer as a last resort.
  const h = await headers();
  const xInvokePath = h.get("x-invoke-path") || "";
  const xMatchedPath = h.get("x-matched-path") || "";
  const referer = h.get("referer") || "";

  let pathSource = xInvokePath || xMatchedPath;
  if (!pathSource && referer) {
    try {
      const url = new URL(referer);
      pathSource = url.pathname || "";
    } catch {
      // ignore URL parse errors
    }
  }

  if (pathSource) {
    const firstSeg = pathSource.split("/").filter(Boolean)[0];
    if (firstSeg && VALID_LANGUAGES.includes(firstSeg)) {
      return firstSeg as SupportedLang;
    }
  }

  // Default
  return 'th';
}
