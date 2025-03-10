import { DefaultSession, DefaultUser } from "next-auth";
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      email?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    token: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    email?: string;
    role?: string;
  }
}
