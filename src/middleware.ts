import { NextRequest, NextResponse } from 'next/server';
import {LANGUAGE_COOKIE} from "@/constants/language";

// NOTE: Use the actual cookie name string. If the browser has `const LANGUAGE_COOKIE = 'u:lng'`,
// middleware must also use 'u:lng' (the value), not the identifier text.
const CK = { SID: 'sid', TERMS: 'needsTerms', LNG: 'u:lng' } as const;

const STATIC_PATHS = ['/_next', '/favicon', '/robots', '/sitemap', '/images', '/fonts', '/static'];
const PROTECTED_PATHS = ['/dashboard', '/account', '/chat']; // ← ปรับตรงนี้ได้

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

    const sid = req.cookies.get(CK.SID)?.value;
    const needsTerms = req.cookies.get(CK.TERMS)?.value === '1';

    // --- language resolution: query > path > cookie > browser ---
    const qlng = req.nextUrl.searchParams.get('lng') || req.nextUrl.searchParams.get('lang');
    const pathLng = langFromPath(pathname);
    const cookieLng = req.cookies.get(CK.LNG)?.value
      ?? req.cookies.get(LANGUAGE_COOKIE)?.value
      ?? '';
    const effectiveLng = normalizeLang(qlng || pathLng || cookieLng || langFromBrowser(req));

    const setLangCookie = (resp: NextResponse, value: string) => {
        resp.cookies.set(CK.LNG, value, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
        return resp;
    };

    // --- protect dynamic routes ---
    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
    if (isProtected && !sid) {
        const login = new URL('/login', req.url);
        login.searchParams.set('next', pathname + search);
        const resp = NextResponse.redirect(login);
        if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
        return resp;
    }

    // --- terms gate ---
    if (sid && needsTerms && !pathname.startsWith('/update-terms')) {
        const resp = NextResponse.redirect(new URL('/update-terms', req.url));
        if (cookieLng !== effectiveLng) setLangCookie(resp, effectiveLng);
        return resp;
    }
    // --- i18n auto prefix + persist cookie ---
    if (!pathLng) {
        const resp = NextResponse.rewrite(new URL(`/${effectiveLng}${pathname}${search}`, req.url));
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