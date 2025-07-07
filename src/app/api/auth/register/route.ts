import { API_ROUTES } from "@/api/endpoints";
import { ERROR_CONSTANTS } from "@/constants/error";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const res = await fetch(
      // process.env.NEXT_PUBLIC_API_BASE_URL + API_ROUTES.auth.register,
      process.env.NEXT_PUBLIC_API_BASE_URL_V2 + API_ROUTES.auth_v2.register_v2,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: body.username,
          email: body.email,
          password: body.password,
          password_verify: body.password_verify,
          captcha_uuid: body.captcha_uuid,
          captcha_answer: body.captcha_answer,
        }),
      }
    );

    const data = await res.json();
    console.log("data", data);

    if (!res.ok) {
      const fieldErrors: Record<string, string> = {};

      switch (data.error) {
        case "invalid_name":
          fieldErrors.username = ERROR_CONSTANTS.USERNAME_INVALID;
          break;
        case "username_already_exists":
          fieldErrors.username = ERROR_CONSTANTS.USERNAME_EXIST;
          break;
        case "email_already_exists":
          fieldErrors.email = ERROR_CONSTANTS.EMAIL_EXIST;
          break;
        case "captcha_incorrect":
          fieldErrors.captcha_answer = ERROR_CONSTANTS.CAPTCHA_WRONG;
          break;
      }

      const errorMessage =
        fieldErrors.email ||
        fieldErrors.username ||
        fieldErrors.captcha_answer ||
        ERROR_CONSTANTS.LIMIT_SEND_EMAIL;

      return NextResponse.json(
        {
          error: errorMessage,
          fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Registration error:", error);
      return NextResponse.json(
        { error: error.message || "Lỗi server" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}
