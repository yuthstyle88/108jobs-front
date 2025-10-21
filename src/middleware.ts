import {type NextRequest, NextResponse} from "next/server";
import {middleware as langMiddleware} from "./middlewareLang";
import {authCookieName} from "@/utils/config";
import {VALID_LANGUAGES} from "@/constants/language";
import {jwtDecode} from "jwt-decode";
import {Claims} from "@/services/UserService";

function getApplicationPending(token: string): boolean | null {
  if (!token) return null;
  const payload = jwtDecode<Claims>(token);
  if (!payload) return null;
  return !payload.accepted_application;
}

// All protected routes that require login (no role restrictions)
const protectedRoutes: string[] = [
  "/account-setting",
  "/employer/applicants",
  "/apply-freelance",
  "/favorites",
  "/reward",
  "/job-board/create-job",
  "/chat",
  "/seller",
  "/seller-account-setting",
  "/manage-product",
];

// Public route prefixes (match exact or any subpath under these)
const publicRoutePrefixes: string[] = [
  "/job-board",
  "/apply-freelance/landing",
  "/coin",
  "/promotion",
];

export async function middleware(req: NextRequest) {
  // Skip all middleware logic for prefetch/prerender requests to avoid interfering with navigation
  const purpose = req.headers.get("purpose") || req.headers.get("sec-purpose") || "";
  if (purpose.toLowerCase().includes("prefetch") || purpose.toLowerCase().includes("prerender")) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  const searchParams = req.nextUrl.searchParams;
  const isRscOrDataReq = (
    searchParams.has("rsc") ||
    searchParams.has("_rsc") ||
    searchParams.has("next-router-state-tree") ||
    searchParams.has("__nextDataReq")
  );

  // For RSC/flight/data requests without a language prefix, rewrite internally to include the current/default language.
  if (isRscOrDataReq) {
    const pathSegments = pathname.split("/");
    const firstSegment = pathSegments[1] ?? "";
    const hasLangPrefix = VALID_LANGUAGES.includes(firstSegment);
    if (!hasLangPrefix) {
      // Lazy import to avoid unnecessary work when not needed
      const { getCurrentLanguage } = await import("@/actions/getCurrentLanguage");
      const lang = await getCurrentLanguage();
      const url = req.nextUrl.clone();
      url.pathname = `/${lang}${pathname}`;
      // Preserve existing search parameters
      return NextResponse.rewrite(url);
    }
    // Already has a language prefix; proceed
    return NextResponse.next();
  }

  const rawCookie = req.cookies.get(authCookieName)?.value ?? "";
  const applicationPending = getApplicationPending(rawCookie);
  const langRedirect = await langMiddleware(req);
  if (langRedirect) return langRedirect;

  const pathSegments = pathname.split("/");
  const firstSegment = pathSegments[1] ?? "";
  const hasLangPrefix = VALID_LANGUAGES.includes(firstSegment);
  const langPrefix = hasLangPrefix ? `/${firstSegment}` : "";
  const cleanPathname = hasLangPrefix
    ? (pathname.slice(langPrefix.length) || "/")
    : (pathname || "/");

  if (applicationPending === true && cleanPathname !== "/update-term") {
    const url = req.nextUrl.clone();
    url.pathname = `${langPrefix}/update-term`;
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Allow public routes by prefix (e.g., "/job-board" and "/job-board/*")
  if (publicRoutePrefixes.some((prefix) =>
    cleanPathname === prefix || cleanPathname.startsWith(prefix + "/")
  )) {
    return NextResponse.next();
  }

  const isLoggedIn = Boolean(rawCookie);

  if (cleanPathname === "/login") {
    if (!isLoggedIn) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = `${langPrefix}/`;
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (!protectedRoutes.some((route) => cleanPathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(cleanPathname);
    const url = req.nextUrl.clone();
    url.pathname = `${langPrefix}/login`;
    url.search = `?redirect=${callbackUrl}`;
    return NextResponse.redirect(url);
  }

  // No role-based restrictions; logged-in users can access all protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|lottie).*)"],
};