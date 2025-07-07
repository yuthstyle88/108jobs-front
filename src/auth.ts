import {
  axiosPublic,
} from "./lib/axios";
import { jwtDecode } from "jwt-decode";
import NextAuth, { type AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";

declare module "next-auth" {
  interface User extends AdapterUser {
    id?: string;
    email?: string | null;
    exchange_key?: string;
    roles?: string[];
  }

  interface AdapterUser {
    id?: string;
    email?: string | null;
    exchange_key?: string;
    roles?: string[];
  }

  interface Session {
    user: {
      id?: string;
      email?: string | null;
      exchange_key?: string;
      roles?: string[];
    };
    accessToken?: string;
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
  }
}

interface JWTPayload {
  sub: string;
  roles: string[];
  exchange_key?: string;
  iat: number;
  exp: number;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username_or_email: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          if (credentials.token) {
            const token = credentials.token as string;
            const decoded = jwtDecode<JWTPayload>(token);

            if (Date.now() >= decoded.exp * 1000) {
              throw new Error("Token expired");
            }

            return {
              id: decoded.sub,
              email: decoded.sub,
              roles: decoded.roles,
              token: token,
            };
          }

          if (credentials.username_or_email && credentials.password) {
            const parsed = await signInSchema.parseAsync({
              username_or_email: credentials.username_or_email,
              password: credentials.password,
              // email: credentials.email,
              // password: credentials.password,
            });

            const res = await fetch(
              // process.env.NEXT_PUBLIC_API_BASE_URL + "/users/login",
              process.env.NEXT_PUBLIC_API_BASE_URL_V2 + "/account/auth/login",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed),
              }
            );

            const data = await res.json();

            if (res.ok && data.jwt) {
              const decoded = jwtDecode<JWTPayload>(data.jwt);
              return {
                id: decoded.sub,
                email: decoded.sub,
                roles: decoded.roles,
                token: data.jwt,
                exchange_key: data.exchange_key, // เพิ่ม exchange key จาก response
              };
            }
          }

          return null;
        } catch (error) {
          const e = error as AuthError;
          console.error("Authentication error:", e);
          throw new Error(e.type || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.roles = user.roles;
        token.email = user.email!;
        token.exchange_key = user.exchange_key; // เพิ่ม exchange key
      }
      if (user?.exchange_key) {
        try {
          const exchangeResult = await axiosPublic.post(user.exchange_key);
          token.accessToken = exchangeResult.token;
          // อัพเดทข้อมูลอื่นๆ ถ้าจำเป็น
          token.roles = exchangeResult.user.roles;
          token.exchange_key = user.exchange_key;
        } catch (error) {
          console.error("Failed to exchange token:", error);
        }

        return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        email: token.email!,
        roles: Array.isArray(token.roles) ? token.roles : [],
        exchange_key: token.exchange_key, // เพิ่ม exchange key
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
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