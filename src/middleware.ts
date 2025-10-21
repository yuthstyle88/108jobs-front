import {type NextRequest, NextResponse} from "next/server";
import {middleware as langMiddleware} from "./middlewareLang";
import {authCookieName} from "@/utils/config";
import {VALID_LANGUAGES} from "@/constants/language";
import {jwtDecode} from "jwt-decode";
import {Claims} from "@/services/UserService";

function isNextDataLike(req: NextRequest): boolean {
  const headers = req.headers;
  const purpose = (headers.get("purpose") || headers.get("sec-purpose") || "").toLowerCase();
  const dest = (headers.get("sec-fetch-dest") || "").toLowerCase();
  const accept = (headers.get("accept") || "").toLowerCase();
  // Next internal signals for app-router client nav / prefetch
  const isPrefetch = purpose.includes("prefetch") || headers.get("x-middleware-prefetch") === "1";
  const isRSC = accept.includes("text/x-component"); // flight/RSC requests
  const isNextDataHeader = headers.has("x-nextjs-data") || headers.has("next-router-prefetch");
  const isNavigateDoc = dest === "document" && (headers.get("sec-fetch-mode") || "").toLowerCase() === "navigate";
  // We only want to bypass for RSC/data/prefetch fetches, not for actual document navigations.
  return isPrefetch || isRSC || isNextDataHeader;
}

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
  // Bypass middleware for Next.js internal RSC/flight/prefetch requests to prevent
  // client-side navigation from failing ("Fetch failed loading").
  if (isNextDataLike(req)) {
    return NextResponse.next();
  }
  // Also ignore explicit query markers sometimes present in older/newer Next builds
  const searchParams = req.nextUrl.searchParams;
  if (searchParams.has("rsc") || searchParams.has("_rsc") || searchParams.has("next-router-state-tree") || searchParams.has("__nextDataReq")) {
    return NextResponse.next();
  }

  const rawCookie = req.cookies.get(authCookieName)?.value ?? "";
  const applicationPending = getApplicationPending(rawCookie);
  const langRedirect = await langMiddleware(req);
  if (langRedirect) return langRedirect;

  const { pathname, origin } = req.nextUrl;

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