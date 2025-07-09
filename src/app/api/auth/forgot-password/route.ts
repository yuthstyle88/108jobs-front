import { API_ROUTES } from "@/api/endpoints";
import { ERROR_CONSTANTS } from "@/constants/error";
import { axiosPublic } from "@/lib/axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    await axiosPublic.post(API_ROUTES.auth.forgot_password, {
      email: body.email,
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;

      if (data.error === "auth") {
        return NextResponse.json(
          {
            error: ERROR_CONSTANTS.EMAIL_EXIST,
            fieldErrors: {
              email: ERROR_CONSTANTS.EMAIL_EXIST,
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: data.error || ERROR_CONSTANTS.LIMIT_SEND_EMAIL,
        },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: ERROR_CONSTANTS.SERVER_ERROR },
      { status: 500 }
    );
  }
}
