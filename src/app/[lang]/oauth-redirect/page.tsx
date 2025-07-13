"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OAuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.isNewUser) {
        router.replace("/signup");
      } else {
        router.replace("/");
      }
    }
  }, [status, session, router]);

  return <p>กำลังเข้าสู่ระบบ...</p>;
}