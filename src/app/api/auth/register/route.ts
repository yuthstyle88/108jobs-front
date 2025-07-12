import { API_ROUTES } from "@/api/endpoints";
import { ERROR_CONSTANTS } from "@/constants/error";
import { axiosPublicV2 } from "@/lib/axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    await axiosPublicV2.post(API_ROUTES.auth_v2.register_v2, {
      username: body.username,
      email: body.email,
      password: body.password,
      password_verify: body.password_verify,
      captcha_uuid: body.captcha_uuid,
      captcha_answer: body.captcha_answer,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;
      const fieldErrors: Record<string, string> = {};

      switch (data.error) {
        case "invalid_name":
          fieldErrors.username = "invalid_name";
          break;
        case "username_already_exists":
          fieldErrors.username = "username_already_exists";
          break;
        case "email_already_exists":
          fieldErrors.email = "email_already_exists";
          break;
        case "captcha_incorrect":
          fieldErrors.captcha_answer = "captcha_incorrect";
          break;
      }

      return NextResponse.json(
        { fieldErrors, error: data.error },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: ERROR_CONSTANTS.SERVER_ERROR },
      { status: 500 }
    );
  }
}
