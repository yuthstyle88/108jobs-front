import { NextResponse } from "next/server";
import { ERROR_CONSTANTS } from "@/constants/error";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: ERROR_CONSTANTS.EMAIL_REQUIRED },
        { status: 400 }
      );
    }

    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/users/resend-verify-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      if (data.error === "email_verified") {
        return NextResponse.json(
          { error: ERROR_CONSTANTS.EMAIL_VERIFIED },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: data.error || ERROR_CONSTANTS.RESEND_FAILED },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: ERROR_CONSTANTS.SERVER_ERROR },
      { status: 500 }
    );
  }
}
