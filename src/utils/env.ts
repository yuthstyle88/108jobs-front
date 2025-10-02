import {isBrowser} from "@/utils/browser";
import {testHost} from "@/utils/config";

export function getBaseLocal(s = "") {
  return `http${s}://${process.env.NEXT_PUBLIC_API_HOST_NAME}`;
}

export function getExternalHost() {
  if (isBrowser()) {
    // Prefer server-provided external host when available; fallback to current location host
    const fromIso = (window as any)?.isoData?.lemmyExternalHost;
      return typeof fromIso === 'string' && fromIso.length > 0 ? fromIso : window.location.host;
  }
  return process.env.LEMMY_UI_LEMMY_EXTERNAL_HOST ?? testHost;
}

export function getHost() {
  return isBrowser() ? getExternalHost() : getInternalHost();
}

export function getHttpBase() {
  return getBaseLocal(getSecure());
}

export function getHttpBaseExternal() {
  return `http${getSecure()}://${getExternalHost()}`;
}

export function getHttpBaseInternal() {
  return getBaseLocal(); // Don't use secure here
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
export function isHttps() {
  return getSecure() === "s";
}
