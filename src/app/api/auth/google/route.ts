import { NextResponse } from "next/server";

export async function GET() {
  const googleLoginUrl = process.env.NEXT_PUBLIC_API_GOOGLE_URL + "/login/google";
  return NextResponse.redirect(googleLoginUrl);
}
