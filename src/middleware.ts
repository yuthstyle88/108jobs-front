import { NextResponse, type NextRequest } from "next/server";
import { middleware as langMiddleware } from "./middleware-lang";

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

function getRolesAllowedForPath(pathname: string): ("employer" | "freelancer")[] {
  return (["employer", "freelancer"] as const).filter((role) =>
    roleBasedRoutes[role].some((route) => pathname.startsWith(route))
  );
}

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const langRedirect = langMiddleware(request);
  if (langRedirect) return langRedirect;

  const pathSegments = pathname.split("/");
  const firstSegment = pathSegments[1];
  const langPrefix = VALID_LANGS.includes(firstSegment) ? `/${firstSegment}` : "";
  const cleanPathname = pathname.replace(langPrefix, "") || "/";

  if (publicRoutes.includes(cleanPathname)) {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

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

  // 🚨 จุดนี้ไม่สามารถอ่าน role ได้จาก cookie ตรง ๆ เพราะ cookie เป็น JWT เข้ารหัสอยู่
  // ใน Middleware (Edge) จะไม่มีทาง decode JWT ได้โดยไม่มี Node.js
  // วิธีที่ดีที่สุดคือ: ให้ตรวจแค่ "มี token ไหม" แล้วไปเช็ค role จริงใน Client หรือ Server (หลังจากโหลดหน้า)

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};