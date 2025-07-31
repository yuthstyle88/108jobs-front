import {type NextRequest, NextResponse} from "next/server";
import {middleware as langMiddleware} from "./middleware-lang";
import {authCookieName} from "@/utils/config";
import {VALID_LANGUAGES} from "@/constants/language";

// can't import from a type
export enum RoleType {
  Employer = "Employer",
  Freelancer = "Freelancer",
}

function decodePayload(token: string) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(
      payloadBase64.replace(/-/g,
        "+").replace(/_/g,
        "/")
    );
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

function getUserRole(req: NextRequest): RoleType | null {
  const token = req.cookies.get(authCookieName)?.value;
  const url = new URL(req.url); // แปลง Request URL เป็น Object
  const pathname = url.pathname; // ดึง path (เช่น /vi หรือ /th)
  const langFromURL = pathname.split("/")[1];

  console.log("langFromURL",
    langFromURL)
  if (!token) return null;

  const payload = decodePayload(token);
  if (
    payload?.role === RoleType.Employer ||
    payload?.role === RoleType.Freelancer
  ) {
    return payload.role;
  }
  return null;
}

const roleBasedRoutes: Record<RoleType, string[]> = {
  [RoleType.Employer]: [
    "/account-setting",
    "/employer/applicants",
    "/apply-freelance",
    "/favorites",
    "/reward",
    "/job-board/create-job",
    "/chat",
  ],
  [RoleType.Freelancer]: [
    "/seller",
    "/seller-account-setting",
    "/manage-product",
    "/favorites",
    "/reward",
    "/job-board/create-job",
    "/chat",
  ],
};

const publicRoutes = [
  "/job-board",
  "/apply-freelance/landing",
  "/coin",
  "/promotion",
];

const protectedRoutes = Object.values(roleBasedRoutes).flat();

function getRolesAllowedForPath(pathname: string): RoleType[] {
  return [RoleType.Employer, RoleType.Freelancer].filter((role) =>
    roleBasedRoutes[role].some((route) => pathname.startsWith(route))
  );
}

export async function middleware(req: NextRequest) {

  const {pathname, origin} = req.nextUrl;

  const langRedirect = langMiddleware(req);
  if (langRedirect) return langRedirect;

  const pathSegments = pathname.split("/");
  const firstSegment = pathSegments[1];
  const langPrefix = VALID_LANGUAGES.includes(firstSegment)
    ? `/${firstSegment}`
    : "";
  const cleanPathname = pathname.replace(langPrefix,
    "") || "/";


  if (publicRoutes.includes(cleanPathname)) {
    return NextResponse.next();
  }

  const rawCookie = req.cookies.get(authCookieName)?.value;
  const isLoggedIn = Boolean(rawCookie);

  if (cleanPathname === "/login") {
    if (!isLoggedIn) return NextResponse.next();
    return NextResponse.redirect(new URL(`${langPrefix}/`,
      origin));
  }

  if (!protectedRoutes.some((route) => cleanPathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(cleanPathname);
    return NextResponse.redirect(
      new URL(`${langPrefix}/login?redirect=${callbackUrl}`,
        origin)
    );
  }
  const userRole = getUserRole(req);

  if (cleanPathname.startsWith("/seller") && userRole !== RoleType.Freelancer) {
    return NextResponse.redirect(
      new URL(`${langPrefix}/start-selling`,
        origin)
    );
  }

  const allowedRoles = getRolesAllowedForPath(cleanPathname);

  if (allowedRoles.length === 1 && allowedRoles[0] !== userRole) {
    return NextResponse.redirect(new URL(`${langPrefix}/`,
      origin));
  }
  //
  // const isAuthorized = allowedRoles.some((role) => userRoles.includes(role));
  // if (!isAuthorized) {
  //   return NextResponse.redirect(new URL(`${langPrefix}/`, origin));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};