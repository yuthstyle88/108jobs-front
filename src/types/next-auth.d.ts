import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      email?: string;
      roles?: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    token: string;
    roles?: string[];
  }

  interface EventCallbacks {
    signOut: (message: { token: JWT | null }) => Promise<void> | void;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    email?: string;
    roles?: string[];
  }
}