import { NextResponse, type NextRequest } from "next/server";
// import { auth } from "./auth";
import { middleware as langMiddleware } from "./middleware-lang";
import {getCachedSession} from "@/lib/authUtils";

const VALID_LANGS = ["vi", "en", "th"];

const roleBasedRoutes: Record<"employer" | "freelancer", string[]> = {
  employer: [
    "/account-setting",
    "/employer/applicants",
    "/apply-freelance",
    "/favorites",
    "/reward",
    "/job-board/create-job",
    "/chat",
  ],
  freelancer: [
    "/seller",
    "/seller-account-setting",
    "/manage-product",
    "/favorites",
    "/reward",
    "/job-board/create-job",
    "/chat"
  ],
};

const publicRoutes = [
  "/job-board",
  "/apply-freelance/landing",
  "/coin",
  "/promotion",
];

const protectedRoutes = Object.values(roleBasedRoutes).flat();

function getRolesAllowedForPath(
  pathname: string
): ("employer" | "freelancer")[] {
  return (["employer", "freelancer"] as const).filter((role) =>
    roleBasedRoutes[role].some((route) => pathname.startsWith(route))
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const langRedirect = langMiddleware(request);
  if (langRedirect) return langRedirect;

  const pathSegments = pathname.split("/");
  const firstSegment = pathSegments[1];
  const langPrefix = VALID_LANGS.includes(firstSegment)
    ? `/${firstSegment}`
    : "";
  const cleanPathname = pathname.replace(langPrefix, "") || "/";

  if (publicRoutes.includes(cleanPathname)) {
    return NextResponse.next();
  }

  if (cleanPathname === "/login") {
    const session = await getCachedSession();
    if (!session?.user) return NextResponse.next();
    return NextResponse.redirect(new URL(`${langPrefix}/`, origin));
  }

  if (!protectedRoutes.some((route) => cleanPathname.startsWith(route))) {
    return NextResponse.next();
  }

  const session = await getCachedSession();
  if (!session?.user) {
    const callbackUrl = encodeURIComponent(cleanPathname);
    return NextResponse.redirect(
      new URL(`${langPrefix}/login?redirect=${callbackUrl}`, origin)
    );
  }

  const userRoles = session.user.roles as string[];

  if (
    cleanPathname.startsWith("/seller") &&
    !userRoles.includes("freelancer")
  ) {
    return NextResponse.redirect(
      new URL(`${langPrefix}/start-selling`, origin)
    );
  }

  const allowedRoles = getRolesAllowedForPath(cleanPathname);

  if (
    allowedRoles.length === 1 &&
    allowedRoles[0] === "employer" &&
    userRoles.includes("freelancer")
  ) {
    return NextResponse.redirect(new URL(`${langPrefix}/`, origin));
  }

  const isAuthorized = allowedRoles.some((role) => userRoles.includes(role));
  if (!isAuthorized) {
    return NextResponse.redirect(new URL(`${langPrefix}/`, origin));
  }
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/job-board') ||
    pathname.startsWith('/promotion')
  ) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
