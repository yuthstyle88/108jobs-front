import {isBrowser} from "@/utils/browser";
import {testHost} from "@/utils/config";

function normalizeHost(v?: string): string {
  if (!v) return '';
  try {
    // If value already includes scheme, use URL to parse and extract host[:port]
    if (/^https?:\/\//i.test(v)) {
      const u = new URL(v);
      return u.host; // host = hostname[:port]
    }
    // Otherwise, trim any leading/trailing slashes and whitespace
    return String(v).trim().replace(/^\/*/, '').replace(/\/*$/, '');
  } catch {
    return String(v).trim();
  }
}

/**
 * API base used for server-side/internal calls (SSR, workers).
 * Chooses host from env and scheme via getSecure().
 */
export function getApiBaseInternal(): string {
  const scheme = getSecure();
  const raw = process.env.LEMMY_UI_LEMMY_INTERNAL_HOST
    ?? process.env.NEXT_PUBLIC_API_HOST_NAME
    ?? testHost;
  const host = normalizeHost(raw);
  return `http${scheme}://${host}`;
}

/**
 * UI-facing external host (the public hostname the browser should target).
 */
export function getUiExternalHost(): string {
  if (isBrowser()) {
    const fromIso = (window as any)?.isoData?.lemmyExternalHost;
    const raw = (typeof fromIso === 'string' && fromIso.length > 0)
      ? fromIso
      : window.location.host;
    return normalizeHost(raw);
  }
  return normalizeHost(process.env.LEMMY_UI_LEMMY_EXTERNAL_HOST ?? testHost);
}

export function getHost(): string {
  return isBrowser() ? getUiExternalHost() : getApiInternalHost();
}

/**
 * Resolve the API base URL depending on runtime:
 * - Browser → external (public) API base (forced HTTPS)
 * - Server  → internal API base (scheme via getSecure)
 */
export function getApiBase(): string {
  return isBrowser() ? getApiBaseExternal() : getApiBaseInternal();
}

/**
 * Public API base for browser usage. Always HTTPS.
 */
export function getApiBaseExternal(): string {
  return `https://${getUiExternalHost()}`;
}

export function getApiHttpBaseInternal() {
  return getApiBaseInternal();
}

export function getApiInternalHost(): string {
  return !isBrowser()
    ? normalizeHost(process.env.LEMMY_UI_LEMMY_INTERNAL_HOST ?? testHost)
    : normalizeHost(testHost); // used for local dev
}

export function getSecure(): string {
  if (isBrowser()) {
    return window.location.protocol === "https:" ? "s" : "";
  }
  const raw =
    (process.env.NEXT_PUBLIC_USE_HTTPS ?? process.env.USE_HTTPS ?? "")
      .toString()
      .trim()
      .toLowerCase();
  return (raw === "true" || raw === "1" || raw === "yes" || raw === "on") ? "s" : "";
}


/**
 * Returns path to static directory, intended
 * for cache-busting based on latest commit hash.
 */
export function getStaticDir() {
  return `/static/${process.env.COMMIT_HASH}`;
}

/**
 * This is for html tags, don't include port
 */
export function httpExternalPath(path: string) {
  const host = getUiExternalHost() ?? "";
  return `http${getSecure()}://${host.replace(/:\d+/g, "")}${path}`;
}

export function isHttps() {
  return getSecure() === "s";
}

export const getHttpBase = getApiBase; // DEPRECATED