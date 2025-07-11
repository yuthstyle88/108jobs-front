"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { setCachedToken } from "@/lib/axios";  // ✅ ฟังก์ชันที่คุณมีแล้ว

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    setCachedToken(session?.accessToken ?? null);
  }, [session]);

  return <>{children}</>;
}