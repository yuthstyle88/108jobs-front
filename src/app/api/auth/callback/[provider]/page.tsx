"use client";

import { LandingImage } from "@/constants/images";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {axiosPublicV2} from "@/lib/axios";

export default function CallbackPage() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const [sending, setSending] = useState(true);
  const [sendError, setSendError] = useState<null | string>(null);

  useEffect(() => {
    // Grab OAuth params from the URL
    const code = searchParams.get("code");

    const pathname = window.location.pathname;
    const segments = pathname.split("/");
    const oauth_provider = segments[segments.length - 1];

    if (!code) {
      setSendError("Missing OAuth code");
      setSending(false);
      return;
    }

    (async () => {
      try {
        // Retrieve the information we stored before redirecting to Google
        const oauthStateRaw = localStorage.getItem("jwt");
        let oauthState: any = {};
        try {
          oauthState = oauthStateRaw ? JSON.parse(oauthStateRaw) : {};
        } catch {
          /* ignore JSON parse errors – we'll fall back to empty object */
        }
        const redirectUri = `${window.location.origin}/api/auth/callback/${oauth_provider}`;
        const payload = {
          code,
          oauthProvider: oauth_provider,
          oauthProviderId: oauthState.oauth_provider_id,
          redirectUri: redirectUri ,
          answer: "FastJob",
          name: oauthState.username ?? undefined,
          email: oauthState.email ?? undefined,
          roles: oauthState.roles ?? undefined,
        };

        const res = await axiosPublicV2.post("/oauth/authenticate", payload);

        if (res.status !== 200) {
          throw new Error(`Server responded ${res.status}`);
        }

        // Clean up stored oauth state
        localStorage.removeItem("jwt");
        sessionStorage.setItem("jwt", res.data.jwt);
        if (res.data.registration_created) {
          router.replace("/sign-up?newUser=true");
        } else {
          router.replace( "/");
        }

      } catch (err: any) {
        console.error("Failed to complete OAuth flow:", err);
        setSendError(err.message ?? "Unknown error");
      } finally {
        setSending(false);
      }
    })();
  }, [searchParams, router]);
}
