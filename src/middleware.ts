import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

type UserRole = "employer" | "freelancer";

const secret = process.env.AUTH_SECRET;

const roleBasedRoutes: Record<UserRole, string[]> = {
  employer: ["/account-setting", "/employer/jobs", "/employer/applicants"],
  freelancer: ["/seller", "/freelancer/jobs", "/freelancer/proposals"],
};

const protectedRoutes = Object.values(roleBasedRoutes).flat();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret });
  if (!token) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/login?redirect=${callbackUrl}`, request.url)
    );
  }

  const userRole = token.role as UserRole;
  const allowedRoutes = roleBasedRoutes[userRole];

  if (pathname.startsWith("/seller") && userRole !== "freelancer") {
    return NextResponse.redirect(new URL("/start-selling", request.url));
  }

  if (
    !allowedRoutes ||
    !allowedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
