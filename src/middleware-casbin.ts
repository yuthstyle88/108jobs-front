// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkPermission } from "@/lib/";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Authentication (เอา session หรือ token)
  const userRole = request.headers.get("x-role") || "guest";

  // Authorization (ใช้ Casbin ตรวจสอบสิทธิ์)
  const isAllowed = await checkPermission(userRole, pathname, "view");

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/403", request.nextUrl.origin)); // Redirect ไปยังหน้า 403
  }

  return NextResponse.next();
}