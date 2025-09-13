import {NextRequest, NextResponse} from "next/server";
import {VALID_LANGUAGES} from "@/constants/language";
import { getCurrentLanguage } from "@/actions/getCurrentLanguage";

const PUBLIC_FILE = /\.(.*)$/;

// Server-side language routing middleware.
export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

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

  const lang = await getCurrentLanguage();

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${lang}${pathname}`;

  return NextResponse.redirect(redirectUrl);
}
