import {NextRequest, NextResponse} from "next/server";
import {VALID_LANGUAGES} from "@/constants/language";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
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

  // Determine language: cookie > Accept-Language header > default 'th'
  let lang = request.cookies.get("current-language")?.value || "";

  if (!lang) {
    const acceptLang = request.headers.get("accept-language") || "";
    // Parse accept-language like: en-US,en;q=0.9,th;q=0.8
    const prefs = acceptLang.split(",").map(s => s.trim().split(";")[0]);
    const baseCodes = prefs
      .map(code => code.toLowerCase())
      .map(code => code.split("-")[0]); // en-US -> en
    const preferred = baseCodes.find(code => VALID_LANGUAGES.includes(code));
    lang = preferred || "th";
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${lang}${pathname}`;

  return NextResponse.redirect(redirectUrl);
}
