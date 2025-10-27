import { withLocalePrefix, normalizeLang } from "@/utils/localeHref";

function detectCurrentLangFromPath(path: string): string {
  const m = path.match(/^\/(\w{2})(\/|$)/);
  return m ? m[1] : "th";
}

export function handleApiRedirect(error: string, email: string) {
  if (error === "acceptTermsRequired") {
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    const lang = normalizeLang(detectCurrentLangFromPath(path));
    // Build a locale-prefixed target safely (e.g. "/th/update-terms")
    const target = withLocalePrefix(`/update-terms?email=${email}`, lang);
    // Client-side redirect without changing the host
    if (typeof window !== "undefined") {
      window.location.replace(target);
      return;
    }
  }
  throw error;
}