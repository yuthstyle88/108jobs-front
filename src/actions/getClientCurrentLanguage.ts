'use client'
import {LANGUAGES, VALID_LANGUAGES, LANGUAGE_COOKIE} from "@/constants/language";
import {SupportedLang} from "@/lib/metadata";
import { isBrowser } from "@/utils/browser";

// Micro-cache with an invalidation key to avoid stale values when cookies, localStorage, or URL change
let cachedClientLang: SupportedLang | undefined;
let cachedKey: string | undefined;

export function getClientCurrentLanguage(): SupportedLang {
  // SSR-safe guard
  if (!isBrowser()) {
    return 'th';
  }

  const cookieString = document.cookie || "";
  const lsLang = (() => {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem('lang') || undefined : undefined;
    } catch {
      return undefined;
    }
  })();
  const pathname = window.location?.pathname || "";
  const key = `${cookieString}|${lsLang || ''}|${pathname}`;

  if (cachedKey === key && cachedClientLang) return cachedClientLang;

  let lang: string | undefined;

  // 1) Cookie
  const nameEq = `${LANGUAGE_COOKIE}=`;
  const parts = cookieString.split("; ");
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith(nameEq)) {
      lang = decodeURIComponent(part.substring(nameEq.length));
      break;
    }
  }

  // 2) URL prefix
  if (!lang && pathname) {
    const firstSeg = pathname.split('/').filter(Boolean)[0];
    if (firstSeg && VALID_LANGUAGES.includes(firstSeg)) {
      lang = firstSeg;
    }
  }

  // 3) localStorage override/fallback
  if (!lang && lsLang && VALID_LANGUAGES.includes(lsLang)) {
    lang = lsLang;
  }

  // 4) navigator.language heuristic
  if (!lang && typeof navigator !== 'undefined') {
    const nav = (navigator.language || navigator.languages?.[0] || '').toLowerCase();
    if (nav.startsWith('th')) lang = 'th';
    else if (nav.startsWith('vi') || nav.startsWith('vn')) lang = 'vi';
    else if (nav.startsWith('en')) lang = 'en';
  }

  const resolved = lang && VALID_LANGUAGES.includes(lang) ? (lang as SupportedLang) : 'th';
  cachedClientLang = resolved;
  cachedKey = key;
  return resolved;
}

export function getNumericCode(langCode: string): number | null {
  const language = LANGUAGES[langCode as keyof typeof LANGUAGES];
  return language && "numericCode" in language ? language.numericCode : null;
}
