import NextAuth, {User} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import {jwtDecode} from "jwt-decode";
import {
  generateEcKeyPair,
  exportPublicKey,
  importEcPublicKeyHex,
  arrayBufferToHex,
} from "@/lib/web-crypto";
import {exchangePublicKey, sendTokenToApiServer} from "@/lib/api/auth";

interface JWTPayload {
  sub: string;
  roles: string[];
  exp: number;
  session: string;
}

/* Helper function to decode JWT */
const parseJwt = (token: string): JWTPayload | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    if (Date.now() >= decoded.exp * 1_000) return null;
    return decoded;
  } catch {
    return null;
  }
};

/* Combined Options for NextAuth */
export const {handlers, auth, signIn} = NextAuth({
  // Session configuration
  session: {
    strategy: "jwt", // Use JWT
    maxAge: 60 * 60 * 24, // 24 hours
    updateAge: 0,
  },

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET, // Secret key
  trustHost: true, // Trust the deployment host
  pages: {
    signIn: "/login", // Redirect to custom sign-in page
    error: "/error",  // Redirect to error page
  },

  // Authentication Providers
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET
    }),
    // Credentials Provider for Email/Password authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username_or_email: {label: "Email / Username", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          // Call external API for authentication with credentials
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL_V2}/account/auth/login`,
            {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({
                username_or_email: credentials.username_or_email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (res.ok && data.jwt) {
            const decoded = parseJwt(data.jwt);
            return {
              id: decoded?.sub,
              roles: decoded?.roles,
              token: data.jwt,
              session: decoded?.session,
            } as User;
          }
        } catch (err) {
          console.error("Login failed with credentials:",
            err);
        }

        return null;
      },
    }),
  ],

  callbacks: {
    /* Define how JWT token is generated */
    async jwt({token, user, account}) {

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        await sendTokenToApiServer(account.userId as string,
          account.accessToken as string)
      }
      if (user) {
        Object.assign(token,
          {
            accessToken: (user as any).token,
            roles: user.roles,
            email: user.email ?? "",
            session: user.session,
          });
      }
      if (!token.shared_key) {
        try {
          const {publicKey, privateKey} = await generateEcKeyPair();
          const pub = await exportPublicKey(publicKey);
          const tokenStr = token.accessToken;
          const public_key = await exchangePublicKey(pub,
            tokenStr as string);
          const serverPubKey = await importEcPublicKeyHex(public_key);
          const shared_key = await crypto.subtle.deriveBits(
            {name: "ECDH", public: serverPubKey},
            privateKey,
            256
          );
          token.shared_key = arrayBufferToHex(shared_key);
        } catch (e) {
          console.error("Key exchange error:",
            e);
        }
      }

      return token;
    },

    /* Define what the session structure is for the client */
    async session({session, token}) {
      // Attach JWT token and additional attributes to the session
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

    /* Handle redirect logic after signin */
    async redirect({url, baseUrl}) {
      try {
        const _url = new URL(url,
          baseUrl);
        return _url.origin === baseUrl ? _url.href : baseUrl;
      } catch {
        return baseUrl;
      }
    },

    /* Hook to handle sign-in related logic */
    async signIn({account}) {
      if (account?.access_token) {
        try {
          // Optional: Send token to an external API server if needed
        } catch (error) {
          console.error("Failed to process after sign-in:",
            error);
          return false;
        }
      }
      return true;
    },
  },

  // Events: Extend behavior for specific actions (e.g., sign-out)
  events: {
    async signOut(message) {
      const token = "token" in message ? message.token : undefined;

      if (!token) return;
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/logout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      } catch (err) {
        console.error("Sign-out error:",
          err);
      }
    },
  },

  // Logging behavior (optional, define level of verbosity)
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
