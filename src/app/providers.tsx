"use client";

import { SessionProvider } from "next-auth/react";
import { TokenContext } from "@/contexts/TokenContext";
import type { Session } from "next-auth";
import { setCachedToken } from "@/lib/axios";
import {jwtDecode} from "jwt-decode";
import {JWT} from "next-auth/jwt";


export function getSessionFromStorage(): Session | null {
  if (typeof window === 'undefined') {
    return null; // ป้องกันการเรียกใช้บน server-side
  }

  const temp = sessionStorage.getItem("jwt");

  if (!temp) return null;

  try {
    const decoded = jwtDecode(temp) as JWT;
    return {
      user: {
        name: decoded.name || decoded.sub || null,
        email: decoded.email || null,
        roles: decoded.roles,
        token: ""
      },
      // ค่าอื่นๆ ตาม interface Session
      accessToken: temp,
      expires: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error("Error decoding JWT:",
      error);
    return null;
  }
}

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSessionFromStorage();
  const accessToken = session?.accessToken ?? "";
  if (accessToken) {
    setCachedToken(accessToken);
  }

  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>
      <TokenContext.Provider value={accessToken}>
        {children}
      </TokenContext.Provider>
    </SessionProvider>
  );
}
