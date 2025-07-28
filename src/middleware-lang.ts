import { NextRequest, NextResponse } from "next/server";
import {VALID_LANGUAGES} from "@/constants/language";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const firstSegment = pathname.split("/")[1];
  if (VALID_LANGUAGES.includes(firstSegment)) {
    return;
  }

  const lang = request.cookies.get("current-language")?.value || "th";
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${lang}${pathname}`;

  return NextResponse.redirect(redirectUrl);
}
