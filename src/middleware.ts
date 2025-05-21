import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./auth";

const roleBasedRoutes: Record<"employer" | "freelancer", string[]> = {
  employer: [
    "/account-setting",
    "/employer/applicants",
    "/apply-freelance",
    "/favorites",
    "/reward",
    "/consent-management",
    "/job-board/create-job"
  ],
  freelancer: [
    "/seller",
    "/seller-account-setting",
    "/manage-product",
    "/favorites",
    "/reward",
    "/consent-management",
    "/job-board/create-job"
  ],
};

const publicRoutes = ["/job-board","/apply-freelance/landing","/coin","/promotion"];

const protectedRoutes = Object.values(roleBasedRoutes).flat();

function getRolesAllowedForPath(
  pathname: string
): ("employer" | "freelancer")[] {
  return (["employer", "freelancer"] as const).filter((role) =>
    roleBasedRoutes[role].some((route) => pathname.startsWith(route))
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/login") {
    const session = await auth();
    if (!session?.user) return NextResponse.next();
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session?.user) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?redirect=${callbackUrl}`, request.url)
    );
  }

  const userRoles = session.user.roles as string[];

  if (pathname.startsWith("/seller") && !userRoles.includes("freelancer")) {
    return NextResponse.redirect(new URL("/start-selling", request.url));
  }

  const allowedRoles = getRolesAllowedForPath(pathname);

  if (
    allowedRoles.length === 1 &&
    allowedRoles[0] === "employer" &&
    userRoles.includes("freelancer")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isAuthorized = allowedRoles.some((role) => userRoles.includes(role));
  if (!isAuthorized) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
