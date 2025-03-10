import { jwtDecode } from "jwt-decode";
import NextAuth, { type AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";

interface JWTPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
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
              role: decoded.role,
              token: token,
            };
          }

          if (credentials.email && credentials.password) {
            const parsed = await signInSchema.parseAsync({
              email: credentials.email,
              password: credentials.password,
            });

            const res = await fetch(
              "https://fastwork.ibrowe.com/api/v3/users/login",
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
                role: decoded.role,
                token: data.jwt,
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
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        email: token.email!,
        role: typeof token.role === "string" ? token.role : "",
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
});
