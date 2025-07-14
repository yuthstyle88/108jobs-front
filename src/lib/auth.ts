import NextAuth, {User} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import {jwtDecode} from "jwt-decode";
import {authenticateWithOAuth, checkEmailExists, exchange, exchangePublicKey} from "@/lib/api/auth";
import {axiosPrivate, axiosPublicV2} from "@/lib/axios";

interface JWTPayload {
  sub: string;
  roles: string[];
  exp: number;
  session: string;
}

export const parseJwt = (token: string): JWTPayload | null => {
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
    signIn: "/sign-in",
    error: "/error",
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
        username_or_email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password", required: false },
        token: { label: "Token", type: "text", required: false },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;
        let jwt = credentials.token as string | undefined;
        try {
          if(credentials.password !== "dummy_password"){
            const res = await axiosPublicV2.post(`/account/auth/sign-in`,
              {
                username_or_email: credentials.username_or_email,
                password: credentials.password,
              });
            const data = res.data;
            if (res.status === 200 && data.jwt) {
              jwt = data.jwt;
            }
          }

          if (jwt) {
            const decoded = parseJwt(jwt);
            return {
              id: decoded?.sub as string,
              roles: decoded?.roles ?? [],
              token: jwt,
              session: decoded?.session,
            } as User;
          }
        } catch (err) {
          console.error("Authentication failed:",
            err);
        }

        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({token, user, account, trigger}) {
      console.log("▶️ JWT callback:",
        {trigger, hasAccount: !!account, hasUser: !!user});

      if (account && user) {
        try {
          if (trigger === "signIn" && account && user) {
            const res1 = await checkEmailExists(user.email ?? "");
            console.log("🧾 checkEmailExists response:",
              res1.data);

            token.isNewUser = res1.data?.exists === false;

            if (res1.status === 200 && !token.isNewUser) {
              return token;
            }
            const res2 = await authenticateWithOAuth(
              account.provider,
              account.providerAccountId,
              user.name ?? "",
              user.email ?? "");

            if (res2.status !== 200) {
              return null;
            }

            const decoded = parseJwt(res2.data.jwt);
            token.accessToken = res2.data?.jwt ?? "";
            token.roles = decoded?.roles ?? [];
            token.session = decoded?.session;
            token.sub = decoded?.sub || "";
            console.log("🟢 JWT token set:",
              token);
          }
          const accessToken = token.accessToken ?? user.token;
          if (!token.shared_key && accessToken) {
            try {
              token.shared_key = await exchange(accessToken);
            } catch (e) {
              console.error("Key exchange error:",
                e);
            }
          }
        } catch (e) {
          console.error("Sign-in error:",
            e);
        }
      }

      return {
        ...token,
        sub: token.sub,
      };
    },
    async session({session, token}) {
      session.isNewUser = token.isNewUser ?? false;

      // ✅ DEBUG log เพื่อดูว่าได้ isNewUser จริงไหม
      console.log("📦 Session created:",
        {
          email: session.user.email,
          isNewUser: session.isNewUser,
        });

      session.user.email = token.email ?? "";
      session.user.roles = token.roles ?? [];
      session.user.session = token.session;
      session.accessToken = token.accessToken;
      session.shared_key = token.shared_key;
      session.isNewUser = token.isNewUser ?? false;  // ✅ ให้แน่ใจว่ามี
      session.user.id = token.sub!;
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