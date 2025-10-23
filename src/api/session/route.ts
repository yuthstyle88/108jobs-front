import { NextRequest, NextResponse } from 'next/server';
import {authCookieName} from "@/utils";

export async function POST(req: NextRequest) {
    const { jwt } = await req.json();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(authCookieName, jwt, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 วัน
    });
    return res;
}