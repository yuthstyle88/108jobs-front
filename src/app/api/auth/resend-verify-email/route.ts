import { API_ROUTES } from "@/api/endpoints";
import { ERROR_CONSTANTS } from "@/constants/error";
import { axiosPublic } from "@/lib/axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: ERROR_CONSTANTS.EMAIL_REQUIRED },
        { status: 400 }
      );
    }

    await axiosPublic.post(API_ROUTES.auth.resend_verify_email, { email });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;

      if (data.error === "email_verified") {
        return NextResponse.json(
          { error: ERROR_CONSTANTS.EMAIL_VERIFIED },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: data.error || ERROR_CONSTANTS.RESEND_FAILED },
        { status: error.response.status || 400 }
      );
    }

    console.error("Resend error:", error);
    return NextResponse.json(
      { error: ERROR_CONSTANTS.SERVER_ERROR },
      { status: 500 }
    );
  }
}
