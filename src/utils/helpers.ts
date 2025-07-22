import { RequestState } from "@/services/HttpService";
import { PaginationCursor, GetSiteResponse } from "lemmy-js-client";
import {IncomingHttpHeaders} from "http";
import * as cookie from "cookie";
import { authCookieName } from "@/utils/config";
import { Match } from "@/utils/router";
import { ErrorPageData } from "@/utils/types";

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 1000,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args); // ✅ ใช้ this โดยตรงใน arrow function
      }
    }, wait);

    if (callNow) {
      func.apply(this, args); // ✅ ใช้ this โดยตรง
    }
  };
}

type ImmutableListKey =
  | "comment"
  | "commentReply"
  | "personPostMention"
  | "personCommentMention"
  | "community"
  | "privateMessage"
  | "post"
  | "postReport"
  | "commentReport"
  | "privateMessageReport"
  | "registrationApplication";

export function editListImmutable<
  T extends { [key in F]: { id: number } },
  F extends ImmutableListKey,
>(fieldName: F, data: T, list: T[]): T[] {
  return [
    ...list.map(c => (c[fieldName].id === data[fieldName].id ? data : c)),
  ];
}

export function getIdFromString(id?: string): number | undefined {
  return id && id !== "0" && !Number.isNaN(Number(id)) ? Number(id) : undefined;
}

export function getBoolFromString(boolStr?: string): boolean | undefined {
  return boolStr ? boolStr.toLowerCase() === "true" : undefined;
}

export function getPageCursorFromString(
  pageCursor?: string,
): PaginationCursor | undefined {
  return pageCursor ? pageCursor : undefined;
}

type Empty = NonNullable<unknown>;

type QueryMapping<PropsT, FallbacksT extends Empty> = {
  [K in keyof PropsT]-?: (
    input: string | undefined,
    fallback: K extends keyof FallbacksT ? FallbacksT[K] : undefined,
  ) => PropsT[K];
};

export default function getQueryParams<
  PropsT extends Record<string, any>,
  FallbacksT extends Partial<PropsT> = Empty
>(
  processors: QueryMapping<PropsT, FallbacksT>,
  source?: string,
  fallbacks: FallbacksT = {} as FallbacksT,
): PropsT {
  const searchParams = new URLSearchParams(source);
  const ret = {} as PropsT;

  for (const key of Object.keys(processors) as (keyof typeof processors)[]) {
    const processor = processors[key];
    const raw = searchParams.get(key as string) ?? undefined;

    // fallback ต้องกำหนด fallback[key] อย่างระมัดระวัง
    const fallback = (fallbacks?.[key] ?? undefined) as PropsT[typeof key];

    // processor return type ต้องตรงกับ PropsT[key]
    ret[key] = processor(raw, fallback);
  }

  return ret;
}

export function getQueryString<T extends Record<string, string | undefined>>(
  obj: T,
) {
  const searchParams = new URLSearchParams();
  Object.entries(obj)
    .filter(([, val]) => val !== undefined && val !== null)
    .forEach(([key, val]) => searchParams.set(key, val ?? ""));
  const params = searchParams.toString();
  if (params) {
    return "?" + params;
  }
  return "";
}

export function getRandomCharFromAlphabet(alphabet: string): string {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

export function getRandomFromList<T>(list: T[]): T | undefined {
  return list.length === 0
    ? undefined
    : list.at(Math.floor(Math.random() * list.length));
}

export function groupBy<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string,
) {
  return array.reduce(
    (acc, value, index, array) => {
      (acc[predicate(value, index, array)] ||= []).push(value);
      return acc;
    },
    {} as { [key: string]: T[] },
  );
}

export function hostname(url: string): string {
  const cUrl = new URL(url);
  return cUrl.port ? `${cUrl.hostname}:${cUrl.port}` : `${cUrl.hostname}`;
}

export function hsl(num: number) {
  return `hsla(${num}, 35%, 50%, 0.5)`;
}

const SHORTNUM_SI_FORMAT = new Intl.NumberFormat("en-US", {
  maximumSignificantDigits: 3,
  notation: "compact",
  compactDisplay: "short",
});

export function numToSI(value: number): string {
  return SHORTNUM_SI_FORMAT.format(value);
}

export function sleep(millis: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, millis));
}

/**
 * Polls / repeatedly runs a promise, every X milliseconds
 */
export async function poll(promiseFn: any, millis: number) {
  if (window.document.visibilityState !== "hidden") {
    await promiseFn();
  }
  await sleep(millis);
  return poll(promiseFn, millis);
}

const DEFAULT_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randomStr(
  idDesiredLength = 20,
  alphabet = DEFAULT_ALPHABET,
): string {
  /**
   * Create n-long array and map it to random chars from given alphabet.
   * Then join individual chars as string
   */
  return Array.from({ length: idDesiredLength })
    .map(() => {
      return getRandomCharFromAlphabet(alphabet);
    })
    .join("");
}

export function resourcesSettled(resources: RequestState<any>[]) {
  return resources.every(r => r.state === "success" || r.state === "failed");
}

export function validEmail(email: string) {
  const re =
    /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const tldRegex = /([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/;

export function validInstanceTLD(str: string) {
  return tldRegex.test(str);
}

/*
 * Test if the Title is in a valid format:
 *   (?=.*\S.*) checks if the title consists of only whitespace characters
 *   (?=^[^\r\n]+$) checks if the title contains newlines
 */
const validTitleRegex = new RegExp(/(?=(.*\S.*))(?=^[^\r\n]+$)/, "g");
export function validTitle(title?: string): boolean {
  // Initial title is null, minimum length is taken care of by textarea's minLength={3}
  if (!title || title.length < 3) return true;

  return validTitleRegex.test(title);
}

export function validURL(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function dedupByProperty<
  T extends Record<string, any>,
  R extends number | string | boolean,
>(collection: T[], keyFn: (obj: T) => R) {
  return collection.reduce(
    (acc, cur) => {
      const key = keyFn(cur);
      if (!acc.foundSet.has(key)) {
        acc.output.push(cur);
        acc.foundSet.add(key);
      }

      return acc;
    },
    {
      output: [] as T[],
      foundSet: new Set<R>(),
    },
  ).output;
}

export function getApubName({ name, ap_id }: { name: string; ap_id: string }) {
  return `${name}@${hostname(ap_id)}`;
}

/**
 * Next.js-style dynamic route matcher (e.g. `/post/[id]`)
 */
// utils/helpers.ts
export function matchPath(
  pathPattern?: string,
  urlPath?: string
): Match<any> | null {
  // ➊ กันไว้ก่อน – ถ้าอาร์กิวเมนต์เป็น undefined/null
  if (!pathPattern || !urlPath) return null;

  const patternParts = pathPattern.split("/").filter(Boolean);
  const urlParts     = urlPath.split("/").filter(Boolean);

  if (patternParts.length !== urlParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const pattern = patternParts[i];
    const part    = urlParts[i];

    if (pattern.startsWith("[")) {
      const key = pattern.replace(/^\[|\]$/g, "");
      params[key] = decodeURIComponent(part);
    } else if (pattern !== part) {
      return null;
    }
  }

  return {
    params,
    path: urlPath,
    url:  urlPath,
    isExact: true,
  } as Match<any>;
}

export function getJwtCookie(headers: IncomingHttpHeaders): string | undefined {
  return headers.cookie
    ? cookie.parse(headers.cookie)[authCookieName] // This can actually be undefined
    : undefined;
}

export function setForwardedHeaders(headers: IncomingHttpHeaders): {
  [key: string]: string;
} {
  const out: { [key: string]: string } = {};

  if (headers.host) {
    out.host = headers.host;
  }

  const realIp = headers["x-real-ip"];

  if (realIp) {
    out["x-real-ip"] = realIp as string;
  }

  const forwardedFor = headers["x-forwarded-for"];

  if (forwardedFor) {
    out["x-forwarded-for"] = forwardedFor as string;
  }

  const auth = getJwtCookie(headers);

  if (auth) {
    out["Authorization"] = `Bearer ${auth}`;
  }

  return out;
}

export function getErrorPageData(error: Error, site?: GetSiteResponse) {
  const errorPageData: ErrorPageData = {};

  if (site) {
    errorPageData.error = error.message;
  }

  const adminMatrixIds = site?.admins
  .map(({ person: { matrixUserId } }) => matrixUserId)
  .filter(id => id) as string[] | undefined;

  if (adminMatrixIds && adminMatrixIds.length > 0) {
    errorPageData.adminMatrixIds = adminMatrixIds;
  }

  return errorPageData;
}