import {jwtDecode} from "jwt-decode";
import Credentials from "next-auth/providers/credentials";
import {exchangePublicKey} from "./lib/api/auth";
import {exportKey, generateKey} from './lib/web-crypto';
import NextAuth from "next-auth";
import type { User } from 'next-auth';

declare module "next-auth" {
    interface User extends AdapterUser {
        id?: string;
        email?: string | null;
        exchange_key?: string;
        roles?: string[];
        sessionId?: string;
    }

    interface AdapterUser {
        id?: string;
        email?: string | null;
        exchange_key?: string;
        roles?: string[];
        sessionId?: string;
    }

    interface Session {
        user: {
            id?: string;
            email?: string | null;
            exchange_key?: string;
            roles?: string[];
        };
        accessToken?: string;
        sessionId?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        exchange_key?: string;
        roles?: string[];
        accessToken?: string;
        email?: string;
        token: string;
        sessionId?: string;
    }
}

interface JWTPayload {
    sub: string;
    roles: string[];
    exchange_key?: string;
    iat: number;
    exp: number;
    sessionId?: string;
}
interface LoginResponse {
    jwt: string;
    exchange_key?: string;
}

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username_or_email: {label: "Email/Username", type: "text"},
                password: {label: "Password", type: "password"},
                token: {label: "Token", type: "text"},
            },
            authorize: async (credentials): Promise<User | null> => {
                try {
                    if (credentials?.token) {
                        try {
                            const decoded = jwtDecode<JWTPayload>(credentials.token as string);
                            if (Date.now() >= decoded.exp * 1000) {
                                console.warn("Token หมดอายุ");
                                return null;
                            }
                            return {
                                id: decoded.sub,
                                email: decoded.sub,
                                roles: decoded.roles || [],
                                token: credentials.token as string,
                                name: decoded.sub
                            } as User;
                        } catch (e) {
                            console.error("Token ไม่ถูกต้อง:", e);
                            return null;
                        }
                    }

                    if (credentials?.username_or_email && credentials?.password) {
                        try {
                            const response = await fetch(
                                `${process.env.NEXT_PUBLIC_API_BASE_URL_V2}/account/auth/login`,
                                {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        username_or_email: credentials.username_or_email,
                                        password: credentials.password
                                    })
                                }
                            );

                            const data: LoginResponse = await response.json();

                            // ปรับการจัดการ error ใน authorize callback
                            if (!response.ok) {
                                throw new Error('CredentialsSignin');
                            }

                            if (!response.ok || !data.jwt) {
                                return null;
                            }

                            const decoded = jwtDecode<JWTPayload>(data.jwt);
                            return {
                                id: decoded.sub,
                                email: decoded.sub,
                                roles: decoded.roles || [],
                                token: data.jwt,
                                name: decoded.sub,
                                exchange_key: data.exchange_key
                            } as User;
                        } catch (error) {
                            if (process.env.NODE_ENV === 'development') {
                                console.error("เกิดข้อผิดพลาดในการ authorize:", error);
                            }
                            throw new Error('CredentialsSignin');
                        }
                    }

                    return null;
                } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error("เกิดข้อผิดพลาดในการ authorize:", error);
                    }
                    throw new Error('CredentialsSignin');

                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.accessToken = user.token;
                token.roles = user.roles;
                token.email = user.email!;

                // ทำ exchange ครั้งแรกหลัง login
                try {
                    const key = await generateKey();
                    const public_key = await exportKey(key);
                    const response = await exchangePublicKey(public_key)
                    token.exchange_key = response.publicKey
                } catch (error) {
                    console.error("Initial token exchange failed:", error);
                }
            }
            return token;
        },
        async session({session, token}) {
            session.accessToken = token.accessToken as string;
            session.user = {
                ...session.user,
                email: token.email!,
                roles: Array.isArray(token.roles) ? token.roles : [],
                exchange_key: token.exchange_key, // เพิ่ม exchange key
            };
            return session;
        },
        async redirect({url, baseUrl}) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;

            if (new URL(url).origin === baseUrl) return url;

            return baseUrl;
        },
    },
    events: {
        async signOut(message) {
            if ("token" in message) {
                try {
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/logout`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${message.token?.accessToken}`,
                        },
                    });
                } catch (error) {
                    console.error("Backend logout failed:", error);
                }
            }
        },
    },
    pages: {
        signIn: "/login",
        error: "/error",
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24,
    },
});