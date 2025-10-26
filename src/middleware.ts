import { NextRequest, NextResponse } from 'next/server';
import {LANGUAGE_COOKIE} from "@/constants/language";
import {authCookieName} from "@/utils/config";

const STATIC_PATHS = ['/_next', '/favicon', '/robots', '/sitemap', '/images', '/fonts', '/static'];
// Disable protection: make all routes public
const PROTECTED_PATHS: string[] = ['/chat' ,'/account', '/admin'];

function isStatic(p: string) {
    return STATIC_PATHS.some((x) => p.startsWith(x));
}
const SUPPORTED = ['th', 'en', 'vi'] as const;
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

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    if (isStatic(pathname)) return NextResponse.next();

    const rawCookie = req.cookies.get(authCookieName)?.value;
    const sid = Boolean(rawCookie);
    // Read claims from JWT (Edge-safe decode, no verification). Fall back to cookie when absent.
    let acceptedTerms: boolean | undefined;
    let jwtLang: string | undefined;
    try {
        const claims = parseJwtClaims(rawCookie) as any;
        const v = claims?.acceptedTerms;
        acceptedTerms = typeof v === 'boolean' ? v : undefined;
        jwtLang = typeof claims?.lang === 'string' ? claims.lang : undefined;
    } catch {}
    // If the user is signed-in and the token does not explicitly confirm acceptance, assume they still need to accept.
    const needsTerms = acceptedTerms !== true;
    // --- language resolution (shared precedence): path > cookie > JWT > browser ---
    const cookieLng = req.cookies.get(LANGUAGE_COOKIE)?.value ?? '';
    const effectiveLng = resolveLanguage({ pathname, cookieLang: cookieLng, jwtLang, req });

    const setLangCookie = (resp: NextResponse, value: string) => {
        resp.cookies.set(LANGUAGE_COOKIE, value, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
        return resp;
    };

    // --- protect dynamic routes ---
    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
    const isOnLogin = /^\/[a-z]{2}\/login(\/|$)/i.test(pathname);
    if (isProtected && !sid && !isOnLogin) {
        const login = new URL(`/${effectiveLng}/login`, req.url);
        login.searchParams.set('next', pathname + search);
        const resp = NextResponse.redirect(login);
        if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
        return resp;
    }

    // --- terms gate ---
    // 1) If user needs terms (acceptedTerms !== true) → force on protected sections **and** /register
    // 2) If user already accepted terms → leaving /update-terms to home
    const isOnUpdateTerms = /^\/[a-z]{2}\/update-terms(\/|$)/i.test(pathname);
    const isOnRegister    = /^\/[a-z]{2}\/register(\/|$)/i.test(pathname);

    if (sid && needsTerms) {
        const pathNoLang = pathname.replace(/^\/[a-z]{2}(?=\/|$)/i, '');
        const isProtectedAfterLang = PROTECTED_PATHS.some((p) => pathNoLang.startsWith(p));
        if ((isProtectedAfterLang || isOnRegister) && !isOnUpdateTerms) {
            const resp = NextResponse.redirect(new URL(`/${effectiveLng}/update-terms`, req.url));
            if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
            return resp;
        }
    } else if (sid && !needsTerms && isOnUpdateTerms) {
        // Accepted terms already → don't stay on update-terms
        const resp = NextResponse.redirect(new URL(`/${effectiveLng}/`, req.url));
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
    matcher: ['/((?!_next|static|fonts|images|favicon|robots|sitemap|lottie).*)'],
};