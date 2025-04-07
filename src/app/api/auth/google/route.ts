import { API_ROUTES } from "@/api/endpoints";
import { NextResponse } from "next/server";

export async function GET() {
  const googleLoginUrl = process.env.NEXT_PUBLIC_API_GOOGLE_URL + API_ROUTES.auth.login_google;
  return NextResponse.redirect(googleLoginUrl);
}
