import NextAuth  from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { generateEcKeyPair, exportPublicKey, importEcPublicKeyHex, arrayBufferToHex } from "@/lib/web-crypto";
import { exchangePublicKey, sendTokenToApiServer } from "@/lib/api/auth";
import {axiosPrivate, axiosPublicV2} from "@/lib/axios";


interface JWTPayload {
  sub: string;
  roles: string[];
  exp: number;
  session: string;
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

export const {handlers, auth, signIn} = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
    updateAge: 0,
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "",
      clientSecret: process.env.APPLE_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      type: "credentials",
      name: "Credentials",
      credentials: {
        username_or_email: { label: "Email / Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        try {
          const res = await axiosPublicV2.post(`/account/auth/login`,
            {
              username_or_email: credentials.username_or_email,
              password: credentials.password,
            });
          const data = res.data;
          if (res.status === 200 && data.jwt) {
            const decoded = parseJwt(data.jwt);
            return {
              id: decoded?.sub ?? "",
              roles: decoded?.roles ?? [],
              token: data.jwt,
              session: decoded?.session,
            };
          }
        } catch (err) {
          console.error("Login failed:", err);
        }

        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        await sendTokenToApiServer(user.id as string, user.name as string, user.email as string, account.accessToken as string);
      }
      if (user) {
        Object.assign(token, {
          accessToken: (user as any).token,
          roles: user.roles,
          email: user.email ?? "",
          session: user.session,
        });
      }
      if (!token.shared_key) {
        try {
          const { publicKey, privateKey } = await generateEcKeyPair();
          const pub = await exportPublicKey(publicKey);
          const public_key = await exchangePublicKey(pub, token.accessToken as string);
          const serverPubKey = await importEcPublicKeyHex(public_key);
          const shared_key = await crypto.subtle.deriveBits(
            { name: "ECDH", public: serverPubKey },
            privateKey,
            256
          );
          token.shared_key = arrayBufferToHex(shared_key);
        } catch (e) {
          console.error("Key exchange error:", e);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.shared_key = token.shared_key as string;
      session.user = {
        ...session.user,
        session: token.session,
        email: token.email as string,
        roles: (token.roles as string[]) ?? [],
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        const _url = new URL(url, baseUrl);
        return _url.origin === baseUrl ? _url.href : baseUrl;
      } catch {
        return baseUrl;
      }
    },
    async signIn({ account }) {
      return true;
    },
  },
  events: {
    async signOut(message) {
      const token = "token" in message ? message.token : undefined;
      if (!token) return;
      try {
        await axiosPrivate.post(`/profile/logout`,
          {});
      } catch (err) {
        console.error("Sign-out error:", err);
      }
    },
  },
  logger: {
    error(code, ...message) {
      console.error(code, ...message);
    },
    warn(code, ...message) {
      console.warn(code, ...message);
    },
    debug(code, ...message) {
      console.debug(code, ...message);
    },
  },
});