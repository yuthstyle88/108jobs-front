import {type NextRequest, NextResponse} from "next/server";
import {middleware as langMiddleware} from "./middleware-lang";
import {authCookieName} from "@/utils/config";
import {VALID_LANGUAGES} from "@/constants/language";
import {jwtDecode} from "jwt-decode";
import {Claims} from "@/services/UserService";

// can't import from a type
export enum RoleType {
  Employer = "Employer",
  Freelancer = "Freelancer",
}

function getUserRoleAndAppAccept(token: string): [RoleType, boolean] | null {
  if (!token) return null;
  const payload = jwtDecode<Claims>(token);
  if (!payload) return null;
  if (
    payload?.role === RoleType.Employer ||
    payload?.role === RoleType.Freelancer
  ) {
    return [payload.role, !payload.accepted_application];
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
  const rawCookie = req.cookies.get(authCookieName)?.value ?? "";
  const [userRole, applicationPending] = getUserRoleAndAppAccept(rawCookie) ?? [undefined, undefined];
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

  if (applicationPending === true && cleanPathname !== "/update-term") {
    return NextResponse.redirect(
      new URL(`${langPrefix}/update-term`, origin)
    );
  }

  if (publicRoutes.includes(cleanPathname)) {
    return NextResponse.next();
  }

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