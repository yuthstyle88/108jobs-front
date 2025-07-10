import { API_ROUTES } from "@/api/endpoints";
// import { auth } from "@/auth";
import { axiosPrivate } from "@/lib/axios";
import {
  ERROR_CONSTANTS,
  ERROR_VERIFY_EMAIL,
} from "@/constants/error";
import { NextResponse } from "next/server";
import {getCachedSession} from "@/lib/authUtils";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await getCachedSession();

    const response = await axiosPrivate.post(API_ROUTES.auth.verify_change_email, {
      code: body.code,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;

      if (
        data.error === ERROR_VERIFY_EMAIL.invalid_verification_code ||
        data.error === ERROR_VERIFY_EMAIL.verification_code_expired
      ) {
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

    console.error("Verification error:", error);
    return NextResponse.json(
      { error: ERROR_CONSTANTS.SERVER_ERROR },
      { status: 500 }
    );
  }
}
