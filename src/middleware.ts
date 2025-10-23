import { NextRequest, NextResponse } from 'next/server';
import {LANGUAGE_COOKIE} from "@/constants/language";
import {jwtDecode} from "jwt-decode";
import type {Claims} from "@/services/UserService";
import {authCookieName} from "@/utils/config";

const STATIC_PATHS = ['/_next', '/favicon', '/robots', '/sitemap', '/images', '/fonts', '/static'];
// Disable protection: make all routes public
const PROTECTED_PATHS: string[] = [];
function parseJwtClaims(token?: string): { lang?: string; acceptedApplication?: boolean } {
    try {
        if (!token) return {};
        const claims = jwtDecode<Claims>(token);
        return { lang: (claims as any)?.lang, acceptedApplication: (claims as any)?.accepted_application };
    } catch {
        return {};
    }
}

function isStatic(p: string) {
    return STATIC_PATHS.some((x) => p.startsWith(x));
}
const SUPPORTED = ['th', 'en', 'vi'] as const;
type Lang = typeof SUPPORTED[number];

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

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    if (isStatic(pathname)) return NextResponse.next();

    const rawCookie = req.cookies.get(authCookieName)?.value;
    const sid = Boolean(rawCookie);

    const { acceptedApplication, lang: jwtLang } = parseJwtClaims(rawCookie);
   alert(acceptedApplication)
    const needsTerms = !acceptedApplication;

    // --- language resolution: query > path > cookie > browser ---
    const pathLng = langFromPath(pathname);
    const cookieLng = req.cookies.get(LANGUAGE_COOKIE)?.value ?? '';
    const effectiveLng = normalizeLang(pathLng || cookieLng || jwtLang || langFromBrowser(req));

    const setLangCookie = (resp: NextResponse, value: string) => {
        resp.cookies.set(LANGUAGE_COOKIE, value, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
        return resp;
    };

    // --- protect dynamic routes (disabled: all routes are public) ---
    // const pathNoLang = pathname.replace(/^\/[a-z]{2}(?=\/|$)/i, '');
    // const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p) || pathNoLang.startsWith(p));

    // --- terms gate ---
    // Only enforce terms on protected sections to avoid blocking general navigation
     if (sid && needsTerms) {
        const isOnUpdateTerms = /^\/[a-z]{2}\/update-terms(\/|$)/i.test(pathname);
        if (!isOnUpdateTerms) {
            // redirect to language-prefixed update-terms, e.g. /th/update-terms
            const resp = NextResponse.redirect(new URL(`/${effectiveLng}/update-terms`, req.url));
            if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
            return resp;
        }
    }
    // --- i18n auto prefix + persist cookie ---
    if (!pathLng) {
        const resp = NextResponse.redirect(new URL(`/${effectiveLng}${pathname}${search}`, req.url));
        if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
        return resp;
    }

    const resp = NextResponse.next();
    if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
    return resp;
}

// --- matcher (exclude static) ---
export const config = {
    matcher: ['/((?!_next|static|fonts|images|favicon|robots|sitemap|lottie).*)'],
};