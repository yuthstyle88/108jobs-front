import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    shared_key?: string;
    user: User & DefaultSession["user"];
    isNewUser?: boolean;
  }

  interface User extends DefaultUser {
    token: string;
    roles?: string[];
    session?: string;
    isNewUser?: boolean;
  }

  interface EventCallbacks {
    signOut: (message: { token: JWT | null }) => Promise<void> | void;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    email: string;
    roles?: string[];
    shared_key?: string;
    session?: string;
    isNewUser?: boolean;
  }
}