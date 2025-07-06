import { API_ROUTES } from "@/api/endpoints";
import { NextResponse } from "next/server";

export async function GET() {
  // const googleLoginUrl = process.env.NEXT_PUBLIC_API_GOOGLE_URL + API_ROUTES.auth.login_google;
  const googleLoginUrl = process.env.NEXT_PUBLIC_API_BASE_URL_V2 + API_ROUTES.auth_v2.login_google_v2;
  return NextResponse.redirect(googleLoginUrl);
}
