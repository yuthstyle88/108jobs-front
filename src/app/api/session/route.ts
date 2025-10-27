import { NextRequest, NextResponse } from 'next/server';
import {authCookieName, isHttps} from '@/utils';
import {LANGUAGE_COOKIE} from "@/constants/language";
// src/app/api/session/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    return NextResponse.json({ ok: true, route: 'session' });
}

export async function POST(req: NextRequest) {
    let jwt: string | undefined;
    let lang: string | undefined;
    try {
        const body = await req.json();
        jwt = body?.jwt;
        lang = body?.lang;
    } catch {}

    if (!jwt) {
        return NextResponse.json({ ok: false, error: 'jwt required' }, { status: 400 });
    }

    // Redirect to homepage (locale-aware) after setting cookies
    const target = new URL(`/${lang || 'th'}`, req.url);
    const res = NextResponse.redirect(target, { status: 303 });
    const secure = isHttps(req);

    res.cookies.set(authCookieName, jwt, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });
    if (lang) {
        res.cookies.set(LANGUAGE_COOKIE, String(lang), {
            secure,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
        });
    }
    res.headers.set('Cache-Control', 'no-store');
    return res;
}

export async function DELETE() {
    const res = new NextResponse(null, { status: 204 });
    res.cookies.set(authCookieName, '', { path: '/', maxAge: 0 });
    res.headers.set('Cache-Control', 'no-store');
    return res;
}