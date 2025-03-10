import { ERROR_CONSTANTS, ERROR_REGISTER } from "@/constants/error";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL +"/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: body.email,
          username: body.username,
          password: body.password,
          password_verify: body.password_verify,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      if (data.error === ERROR_REGISTER.email_already_exists) {
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
      if (data.error === ERROR_REGISTER.database_error) {
        return NextResponse.json(
          {
            error: ERROR_CONSTANTS.USERNAME_EXIST,
            fieldErrors: {
              username: ERROR_CONSTANTS.USERNAME_EXIST,
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: data.error || "เกิดข้อผิดพลาดในการลงทะเบียน",
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
