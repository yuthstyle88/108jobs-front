import { API_ROUTES } from "@/api/endpoints";
import { auth } from "@/auth";
import { axiosPrivate } from "@/lib/axios";
import { ERROR_CONSTANTS, ERROR_VERIFY_PASSWORD } from "@/constants/error";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axiosPrivate.post(API_ROUTES.auth.update_password, {
      old_password: body.old_password,
      new_password: body.new_password,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;

      if (data.error === ERROR_VERIFY_PASSWORD.invalid_credentials) {
        return NextResponse.json(
          {
            error: ERROR_CONSTANTS.INVALID_OLD_PASSWORD,
            fieldErrors: {
              old_password: ERROR_CONSTANTS.INVALID_OLD_PASSWORD,
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: data.error || "Xác thực email không thành công" },
        { status: 400 }
      );
    }

    console.error("Update password error:", error);
    return NextResponse.json(
      { error: ERROR_CONSTANTS.SERVER_ERROR },
      { status: 500 }
    );
  }
}
