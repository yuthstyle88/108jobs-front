import { ERROR_CONSTANTS, ERROR_VERIFY_EMAIL, ERROR_VERIFY_PASSWORD } from "@/constants/error";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/users/password-change",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: body.token,
          password: body.password,
          password_verify: body.password_verify,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      if (data.error === ERROR_VERIFY_PASSWORD.invalid_password) {
        return NextResponse.json(
          {
            error: ERROR_CONSTANTS.INVALID_PASSWORD,
            fieldErrors: { code: ERROR_CONSTANTS.INVALID_PASSWORD },
          },
          { status: 400 }
        );
      }
      if (data.error === ERROR_VERIFY_EMAIL.verification_code_expired) {
        return NextResponse.json(
          {
            error: ERROR_CONSTANTS.INVALID_CODE,
            fieldErrors: { code: ERROR_CONSTANTS.INVALID_CODE },
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: data.error || "Xác thực email không thành công" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: ERROR_CONSTANTS.SERVER_ERROR },
      { status: 500 }
    );
  }
}
