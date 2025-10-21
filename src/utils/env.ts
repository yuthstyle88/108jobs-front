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

export function getApiBaseLocal(s = "") {
  return `http${s}://${process.env.NEXT_PUBLIC_API_HOST_NAME}`;
}

export function getExternalHost() {
  if (isBrowser()) {
    // Prefer server-provided external host when available; fallback to current location host
    const fromIso = (window as any)?.isoData?.lemmyExternalHost;
    const raw = (typeof fromIso === 'string' && fromIso.length > 0) ? fromIso : window.location.host;
    return normalizeHost(raw);
  }
  return process.env.LEMMY_UI_LEMMY_EXTERNAL_HOST ?? testHost;
}

export function getHost() {
  return isBrowser() ? getExternalHost() : getInternalHost();
}

export function getHttpBase() {
  // Use the browser's current origin in production/runtime to avoid hardcoded localhost
  // Fall back to internal/local base when running on the server (SSR / scripts)
  return isBrowser() ? getHttpBaseExternal() : getApiHttpBaseInternal();
}

export function getHttpBaseExternal() {
  // Always use HTTPS for external calls in runtime
  return `https://${getExternalHost()}`;
}

export function getApiHttpBaseInternal() {
  return getApiBaseLocal("s");
}

export function getInternalHost() {
  return !isBrowser()
    ? (process.env.LEMMY_UI_LEMMY_INTERNAL_HOST ?? testHost)
    : testHost; // used for local dev
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
  const host = getExternalHost() ?? "";
  return `http${getSecure()}://${host.replace(/:\d+/g, "")}${path}`;
}

export function isHttps() {
  return getSecure() === "s";
}
