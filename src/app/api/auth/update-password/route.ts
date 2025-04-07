import { API_ROUTES } from "@/api/endpoints";
import { auth } from "@/auth";
import { ERROR_CONSTANTS, ERROR_VERIFY_PASSWORD } from "@/constants/error";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const session = await auth()

    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + API_ROUTES.auth.update_password,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`, 
        },
        body: JSON.stringify({
          old_password: body.old_password,
          new_password: body.new_password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      if (data.error === ERROR_VERIFY_PASSWORD.invalid_credentials) {
        return NextResponse.json(
          {
            error: ERROR_CONSTANTS.INVALID_OLD_PASSWORD,
            fieldErrors: { old_password: ERROR_CONSTANTS.INVALID_OLD_PASSWORD },
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
