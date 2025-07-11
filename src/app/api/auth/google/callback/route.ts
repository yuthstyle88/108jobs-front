import { API_ROUTES } from "@/api/endpoints";
import { signIn } from "next-auth/react";

import { ERROR_CONSTANTS } from "@/constants/error";
import { axiosPublicV2 } from "@/lib/axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawCode = searchParams.get("code");

  if (!rawCode) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const code = decodeURIComponent(rawCode);

  try {
    const response = await axiosPublicV2.get(API_ROUTES.auth.oauth_google, {
      params: {
        code,
        oauth_provider_id: 1,
      },
    });

    const data = response.data;

    if (!data.jwt) {
      return NextResponse.json(
        { error: "Failed to retrieve token from backend" },
        { status: 401 }
      );
    }

    const result = await signIn("credentials", {
      token: data.jwt,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;

      return NextResponse.json(
        { error: data.error || "Google OAuth failed" },
        { status: error.response.status || 400 }
      );
    }

    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { error: ERROR_CONSTANTS.SERVER_ERROR },
      { status: 500 }
    );
  }
}
