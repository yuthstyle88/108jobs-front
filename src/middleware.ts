import { NextResponse, type NextRequest } from "next/server";
import { middleware as langMiddleware } from "./middleware-lang";
import jwt from "jsonwebtoken";

const TOKEN_COOKIE = "fastjob.session";
const JWT_SECRET  = process.env.JWT_SECRET!;
const VALID_LANGS = ["vi", "en", "th"];

function getUserRoles(req: NextRequest): string[] {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) return [];

  try {
    // payload ควรมี { sub, roles, exp, ... }
    const payload = jwt.verify(token, JWT_SECRET) as { roles?: string[] };
    return payload.roles ?? [];
  } catch (e) {
    // token หมดอายุ / ปลอม
    return [];
  }
}

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

function getRolesAllowedForPath(pathname: string): ("employer" | "freelancer")[] {
  return (["employer", "freelancer"] as const).filter((role) =>
    roleBasedRoutes[role].some((route) => pathname.startsWith(route))
  );
}

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  console.log(secret);

  const { pathname, origin } = req.nextUrl;

  const langRedirect = langMiddleware(req);
  if (langRedirect) return langRedirect;

  const pathSegments = pathname.split("/");
  const firstSegment = pathSegments[1];
  const langPrefix = VALID_LANGS.includes(firstSegment) ? `/${firstSegment}` : "";
  const cleanPathname = pathname.replace(langPrefix, "") || "/";


  if (publicRoutes.includes(cleanPathname)) {
    return NextResponse.next();
  }

  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = Boolean(sessionToken);

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
  const userRoles = getUserRoles(req);

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
  //
  // const isAuthorized = allowedRoles.some((role) => userRoles.includes(role));
  // if (!isAuthorized) {
  //   return NextResponse.redirect(new URL(`${langPrefix}/`, origin));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};