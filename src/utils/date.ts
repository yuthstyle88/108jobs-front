import {Locale, setDefaultOptions} from "date-fns";
import {I18NextService, LanguageService, pickTranslations,} from "@/services/I18NextService";
import {enUS} from "date-fns/locale/en-US";
import {th} from 'date-fns/locale/th'; // Thai
import {vi} from 'date-fns/locale/vi';

import {ImportReport} from "@/utils/dynamic-imports";
import {MyUserInfo} from "lemmy-js-client";

type DateFnsDesc = {resource: Locale; code: string; bundled?: boolean};


const locales: DateFnsDesc[] = [
  {resource: enUS, code: "en-US", bundled: true},
  {resource: th, code: "th"}, // ตัวอย่าง: แทน th ด้วย Locale ที่เหมาะสม
  {resource: vi, code: "vi"}, // ตัวอย่าง: แทน vi ด้วย Locale ที่เหมาะสม
];

const localeByCode = locales.reduce<Record<string, DateFnsDesc>>((acc, l) => {
    acc[l.code] = l;
    return acc;
  },
  {});


// Use pt-BR for users with removed interface language pt_BR.
localeByCode["en_US"] = localeByCode["en-US"];

const EN_US = "en-US";

function langToLocale(lang: string): DateFnsDesc | undefined {
  if (lang === "en") {
    lang = "en-US"; // เปลี่ยน `lang` เป็น code ที่ตรงกับ `localeByCode`
  }

  // กรณี language และ country ซ้ำกัน เช่น "fr-FR" ให้ตัดเหลือแค่ "fr"
  if (lang.includes("-")) {
    const parts = lang.split("-");
    if (parts[0] === parts[1].toLowerCase()) {
      lang = parts[0];
    }
  }

  return localeByCode[lang]; // คืนค่าจาก `localeByCode` ที่ตรงกับ `DateFnsDesc`
}

async function load(locale: DateFnsDesc): Promise<Locale> {
  const supportedLocales: Record<string, Locale> = {
    en: enUS,
    th: th,
  };

  if (typeof locale.resource === "string" && locale.resource in supportedLocales) {
    return supportedLocales[locale.resource];
  }

  throw new Error(`Unsupported locale: ${locale.resource}`);
}


export async function verifyDateFnsImports(): Promise<ImportReport> {
  const report = new ImportReport();
  const promises = locales.map(locale =>
    load(locale)
    .then(x => {
      if (x && x.code === locale.code) {
        report.success.push(locale.code);
      } else {
        throw "unexpected format";
      }
    })
    .catch(err => report.error.push({id: locale.code, error: err})),
  );
  await Promise.all(promises);
  return report;
}

export function bestDateFns(
  languages: readonly string[],
  i18n_full_lang: string,
): DateFnsDesc {
  const [base_lang] = i18n_full_lang.split("-");
  for (const lang of languages.filter(x => x.startsWith(base_lang))) {
    const locale = langToLocale(lang);
    if (locale) {
      return locale;
    }
  }
  // Fallback to base language first, to avoid mixing languages.
  return langToLocale(base_lang) ?? localeByCode[EN_US];
}

export function findDateFnsChunkNames(languages: readonly string[]): string[] {
  let i18n_full_lang = EN_US;
  for (const lang of languages) {
    if (pickTranslations(lang)) {
      i18n_full_lang = lang;
      break;
    }
  }
  const locale = bestDateFns(languages,
    i18n_full_lang);
  if (locale.bundled) {
    return [];
  }
  return [`date-fns-${locale.resource}-js`];
}

export async function setupDateFns(myUserInfo?: MyUserInfo) {
  const i18n_full_lang = I18NextService.i18n.resolvedLanguage ?? EN_US;
  const localeDesc = bestDateFns(
    LanguageService.userLanguages(myUserInfo),
    i18n_full_lang,
  );
  try {
    const locale = await load(localeDesc);
    if (locale) {
      setDefaultOptions({locale});
      return;
    }
  } catch {
    console.error(`Loading ${localeDesc.code} date-fns failed.`);
  }

  setDefaultOptions({locale: enUS});
}

/**
 * Converts timestamp string to unix timestamp in seconds, as used by Lemmy API
 */
export function getUnixTimeLemmy(text?: string): number | undefined {
  return text ? new Date(text).getTime() / 1000 : undefined;
}

/**
 * Converts timestamp string to unix timestamp in millis, as used by Javascript
 */
export function getUnixTime(text?: string): number | undefined {
  return text ? new Date(text).getTime() : undefined;
}

/**
 * This converts a unix time to a local date string,
 * popping to tho nearest minute, and removing the Z for
 * javascript fields.
 */
export function unixTimeToLocalDateStr(unixTime?: number): string | undefined {
  return unixTime
    ? convertUTCDateToLocalDate(new Date(unixTime)).toISOString().slice(0,
      -8)
    : undefined;
}

function convertUTCDateToLocalDate(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}