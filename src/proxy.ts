import { NextRequest, NextResponse } from 'next/server';
import {LANGUAGE_COOKIE} from "@/constants/language";
import {authCookieName} from "@/utils/config";
import {isHttps} from "@/utils";
import {SUPPORTED} from "@/utils/localeHref";

const LOCALE_RE = /^\/([a-z]{2})(\/|$)/i;

function stripLocalePrefix(pathname: string) {
  return pathname.replace(LOCALE_RE, '/');
}
// Disable protection: make all routes public
const PROTECTED_PATHS: string[] = ['/chat' ,'/account', '/admin'];


type Lang = typeof SUPPORTED[number];

function decodeBase64Url(input: string): string {
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = '==='.slice((b64.length + 3) % 4);
    return atob(b64 + pad);
}

function parseJwtClaims(token?: string): any {
    if (!token) return {};
    const parts = token.split('.');
    if (parts.length < 2) return {};
    try {
        const json = decodeBase64Url(parts[1]);
        return JSON.parse(json);
    } catch {
        return {};
    }
}

function normalizeLang(s?: string | null): Lang {
    const v = (s ?? '').toLowerCase().split('-')[0];
    return (SUPPORTED as readonly string[]).includes(v) ? (v as Lang) : 'en';
}

function langFromBrowser(req: NextRequest): Lang {
    const header = req.headers.get('accept-language') ?? '';
    const first = header.split(',')[0];
    return normalizeLang(first);
}

function langFromPath(pathname: string): Lang | null {
    const m = pathname.match(/^\/([a-z]{2})(\/|$)/i);
    return m ? normalizeLang(m[1]) : null;
}

function resolveLanguage(args: { pathname: string; cookieLang?: string; jwtLang?: string; req: NextRequest }): Lang {
    const pathLng = langFromPath(args.pathname);
    const browserLng = langFromBrowser(args.req);
    return normalizeLang(pathLng || args.cookieLang || args.jwtLang || browserLng);
}

export function proxy(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    console.log('middleware', pathname);

    const rawCookie = req.cookies.get(authCookieName)?.value;
    const sid = Boolean(rawCookie);
    // Read claims from JWT (Edge-safe decode, no verification). Fall back to cookie when absent.
    let jwtLang: string | undefined;
    try {
        const claims = parseJwtClaims(rawCookie) as any;
        jwtLang = typeof claims?.lang === 'string' ? claims.lang : undefined;
    } catch {}
    // If the user is signed-in and the token does not explicitly confirm acceptance, assume they still need to accept.

    // --- language resolution (shared precedence): path > cookie > JWT > browser ---
    const cookieLng = req.cookies.get(LANGUAGE_COOKIE)?.value ?? '';
    const effectiveLng = resolveLanguage({ pathname, cookieLang: cookieLng, jwtLang, req });

    const setLangCookie = (resp: NextResponse, value: string) => {
        resp.cookies.set(LANGUAGE_COOKIE, value, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
            secure: isHttps(req),
        });
        return resp;
    };

    // --- protect dynamic routes ---
    const pathNoLang = stripLocalePrefix(pathname);
    const isProtected = PROTECTED_PATHS.some((p) => pathNoLang.startsWith(p));
    const isOnLogin = /^\/[a-z]{2}\/login(\/|$)/i.test(pathname);
    if (isProtected && !sid && !isOnLogin) {
        const login = new URL(`/${effectiveLng}/login`, req.url);
        login.searchParams.set('next', pathname + search);
        const resp = NextResponse.redirect(login);
        if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
        return resp;
    }

    // --- i18n auto prefix + persist cookie ---
    if (!langFromPath(pathname)) {
        const target = new URL(`/${effectiveLng}${pathname}${search}`, req.url);
        // Prevent redirect loop: only redirect when the path actually changes
        if (target.pathname !== pathname || target.search !== search) {
            const resp = NextResponse.redirect(target);
            if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
            return resp;
        }
    }
    const resp = NextResponse.next();
    if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
    return resp;
}

// --- matcher (exclude static) ---
export const config = {
    matcher: [
        // everything except Next internals, static assets, api and uploads
        '/((?!_next|static|fonts|images|favicon|robots|sitemap|lottie|api|uploads).*)',
    ],
};