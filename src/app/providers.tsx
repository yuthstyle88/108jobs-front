"use client";

import { SessionProvider } from "next-auth/react";
import { TokenContext } from "@/contexts/TokenContext";
import type { Session } from "next-auth";
import { setCachedToken } from "@/lib/axios";

export function Providers({
  children,
  session
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const accessToken = session?.accessToken ?? null;
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
