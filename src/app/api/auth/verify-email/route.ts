import { API_ROUTES } from "@/api/endpoints";
import {
  ERROR_CONSTANTS,
  ERROR_VERIFY_EMAIL,
} from "@/constants/error";
import { axiosPublicV2 } from "@/lib/axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axiosPublicV2.post(
      API_ROUTES.auth_v2.verify_email_v2,
      { token: body.token }
    );

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
