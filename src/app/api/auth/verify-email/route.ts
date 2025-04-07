import { API_ROUTES } from "@/api/endpoints";
import { ERROR_CONSTANTS, ERROR_VERIFY_EMAIL } from "@/constants/error";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + API_ROUTES.auth.verify_email,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          register: body.register,
          code: body.code,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      if (data.error === ERROR_VERIFY_EMAIL.invalid_verification_code) {
        return NextResponse.json(
          {
            error: ERROR_CONSTANTS.INVALID_CODE,
            fieldErrors: { code: ERROR_CONSTANTS.INVALID_CODE },
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
