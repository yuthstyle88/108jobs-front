import {type NextRequest, NextResponse} from "next/server";
import {middleware as langMiddleware} from "./middleware-lang";
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

const publicRoutes = [
  "/job-board",
  "/apply-freelance/landing",
  "/coin",
  "/promotion",
];

export async function middleware(req: NextRequest) {
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
    return NextResponse.redirect(new URL(`${langPrefix}/update-term`, origin));
  }

  if (publicRoutes.includes(cleanPathname)) {
    return NextResponse.next();
  }

  const isLoggedIn = Boolean(rawCookie);

  if (cleanPathname === "/login") {
    if (!isLoggedIn) return NextResponse.next();
    return NextResponse.redirect(new URL(`${langPrefix}/`, origin));
  }

  if (!protectedRoutes.some((route) => cleanPathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(cleanPathname);
    return NextResponse.redirect(
      new URL(`${langPrefix}/login?redirect=${callbackUrl}`, origin)
    );
  }

  // No role-based restrictions; logged-in users can access all protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};