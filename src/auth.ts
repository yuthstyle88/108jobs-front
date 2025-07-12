import NextAuth, {User} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import {jwtDecode} from "jwt-decode";
import {generateEcKeyPair, exportPublicKey, importEcPublicKeyHex, arrayBufferToHex} from "@/lib/web-crypto";
import {exchangePublicKey, sendAplicationFormToApiServer, sendTokenToApiServer} from "@/lib/api/auth";
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
    newUser: '/login?view=signUpGoogle',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
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
        username_or_email: {label: "Email / Username", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials): Promise<User | null> {
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
            } as User;
          }
        } catch (err) {
          console.error("Login failed:",
            err);
        }

        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({token, user, account, trigger}) {
      console.log("▶️ JWT callback:", { trigger, hasAccount: !!account, hasUser: !!user });

      if (account && user) {
        try {
          if (trigger === "signIn" && account && user) {
            const res = await sendTokenToApiServer(
              account.provider,
              account.providerAccountId,
              user.name ?? "",
              user.email ?? ""
            );
            console.log("🧾 sendTokenToApiServer response:", res.data);

            const decoded = res.data?.jwt ? parseJwt(res.data.jwt) : null;

            token.id = decoded?.sub ?? user.id ?? "";
            token.accessToken = res.data?.jwt ?? "";
            token.roles = decoded?.roles ?? [];
            token.session = decoded?.session;
            token.isNewUser = res?.data?.registration_created === true;
            console.log("🟢 JWT token set:", token);
          }
        } catch (e) {
          console.error("Key exchange error:", e);
        }
      }

      return token;
    },
    async session({session, token}) {
      session.isNewUser = token.isNewUser ?? false;

      // ✅ DEBUG log เพื่อดูว่าได้ isNewUser จริงไหม
      console.log("📦 Session created:", {
        email: session.user.email,
        isNewUser: session.isNewUser,
      });

      session.user.email = token.email ?? "";
      session.user.roles = token.roles ?? [];
      session.user.session = token.session;
      session.accessToken = token.accessToken;
      session.shared_key = token.shared_key;
      session.isNewUser = token.isNewUser ?? false;  // ✅ ให้แน่ใจว่ามี
      return session;
    },
    async redirect({url, baseUrl}) {
      try {
        const _url = new URL(url,
          baseUrl);
        return _url.origin === baseUrl ? _url.href : baseUrl;
      } catch {
        return baseUrl;
      }
    },

  },
  events: {
    async signIn({user, account, profile, isNewUser}) {
      try {
        console.log("✅ User signed in:", {
          provider: account?.provider,
          isNewUser,
          userId: user.id,
          email: user.email,
        });
      } catch (err) {
        console.error("🚨 Error in signIn event:", err);
      }
    },
    async signOut(message) {
      const token = "token" in message ? message.token : undefined;
      if (!token) return;
      try {
        await axiosPrivate.post(`/profile/logout`,
          {});
      } catch (err) {
        console.error("Sign-out error:",
          err);
      }
    },
  },
  logger: {
    error(code, ...message) {
      console.error(code,
        ...message);
    },
    warn(code, ...message) {
      console.warn(code,
        ...message);
    },
    debug(code, ...message) {
      console.debug(code,
        ...message);
    },
  },
});