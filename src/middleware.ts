import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

type UserRole = "employer" | "freelancer";

const secret = process.env.AUTH_SECRET;

const roleBasedRoutes: Record<UserRole, string[]> = {
  employer: ["/employer/jobs", "/employer/applicants"],
  freelancer: ["/seller", "/freelancer/proposals"],
};

const protectedRoutes = Object.values(roleBasedRoutes).flat();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nếu route không được bảo vệ → cho phép truy cập
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Kiểm tra secret
  if (!secret) {
    console.error("NEXTAUTH_SECRET is missing!");
    throw new Error("Authentication secret is not configured");
  }

  // Lấy token từ request
  const token = await getToken({ req: request, secret });

  // Nếu chưa đăng nhập → chuyển hướng đến trang login
  if (!token) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/login?redirect=${callbackUrl}`, request.url)
    );
  }

  const userRole = token.role as UserRole;

  // Nếu vai trò không hợp lệ → redirect về trang chủ
  if (!Object.keys(roleBasedRoutes).includes(userRole)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const allowedRoutes = roleBasedRoutes[userRole];

  // Trường hợp đặc biệt: seller page chỉ dành cho freelancer
  if (pathname.startsWith("/seller") && userRole !== "freelancer") {
    return NextResponse.redirect(new URL("/start-selling", request.url));
  }

  // Nếu route không thuộc danh sách role được phép truy cập
  if (!allowedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Matcher: chỉ áp dụng middleware cho các route frontend
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
