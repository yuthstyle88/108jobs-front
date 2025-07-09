import NextAuth, {DefaultSession, User} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {jwtDecode} from "jwt-decode";
import {exchangePublicKey} from "@/lib/api/auth";
import {exportPublicKey, generateEcKeyPair, importEcPublicKeyHex} from "@/lib/web-crypto";


declare module "next-auth/jwt" {
    interface JWT {
        session?: string;
        shared_key?: ArrayBuffer;
        accessToken?: string;
        roles?: string[];
        email?: string;
    }
}

declare module "next-auth" {
    interface User {
        shared_key?: CryptoKey;
        token: string;
        roles?: string[];
        session?: string;
    }

    interface Session {
        accessToken?: string;
        user: {
            email?: string;
            roles?: string[];
            shared_key?: CryptoKey;
            session?: string;
        } & DefaultSession["user"];
    }
}

interface JWTPayload {
    sub: string;
    roles: string[];
    exp: number;
    session: string
}


const parseJwt = (token: string): JWTPayload | null => {
    try {
        const decoded = jwtDecode<JWTPayload>(token);
        if (Date.now() >= decoded.exp * 1_000) return null;
        return decoded;
    } catch {
        return null;
    }
};

export const { handlers, auth, signIn} = NextAuth({
    session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    pages: { signIn: "/login", error: "/error" },
    logger: {
        error(code, ...message) {
        },
        warn(code, ...message) {
        },
        debug(code, ...message) {
        }
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username_or_email: { label: "Email / Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(
                credentials: Partial<
                    Record<"username_or_email" | "password" , unknown>
                >,
                _req: Request
            ): Promise<User | null> {
                if (!credentials) return null;

                const res = await fetch(
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
                const data = await res.json();

                if (res.ok && data.jwt) {
                    const decoded = parseJwt(data.jwt);
                    return {
                        id: decoded?.sub,
                        email: decoded?.sub,
                        roles: decoded?.roles,
                        token: data.jwt,
                        session: decoded?.session
                    } as User;
                }
              return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                Object.assign(token, {
                    accessToken: (user as any).token,
                    roles: user.roles,
                    email: user.email,
                    shared_key: user.shared_key,
                    session: user.session,
                });

                /* ทำ exchange key เฉพาะรอบแรก */
                if (!token.shared_key) {
                    try {
                        const tokenStr = (user as any).token;
                        const { publicKey, privateKey } = await generateEcKeyPair();
                        const pub = await exportPublicKey(publicKey);
                        const resp = await exchangePublicKey(pub, tokenStr);
                        const serverPubKey = await importEcPublicKeyHex(resp.public_key);
                        token.shared_key = await crypto.subtle.deriveBits(
                            {name: "ECDH", public: serverPubKey},
                            privateKey,
                            256,
                        )
                    } catch (e) {
                        console.error("exchangePublicKey:", e);
                    }
                }
            }
            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user = {
                ...session.user,
                session: token.session,
                email: token.email as string,
                roles: (token.roles as string[]) ?? [],
                shared_key: token.shared_key as CryptoKey | undefined,
            };
            return session;
        },

        redirect({ url, baseUrl }) {
            try {
                const _url = new URL(url, baseUrl);
                return _url.origin === baseUrl ? _url.href : baseUrl;
            } catch {
                return baseUrl;
            }
        },
    },

    events: {
        async signOut(message) {
            const token =
                "token" in message ? message.token : undefined;

            if (!token) return;
            try {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/logout`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
            } catch (err) {
                console.error("Server sign-out failed:", err);
            }
        },
    },
});