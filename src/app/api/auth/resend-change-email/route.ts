import { API_ROUTES } from "@/api/endpoints";
import { auth } from "@/auth";
import { ERROR_CONSTANTS } from "@/constants/error";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
const session = await auth()
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + API_ROUTES.auth.resend_change_email,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`, 
        },
        body: JSON.stringify({
          new_email: body.email,
        }),
      }
    );
    
    const data = await res.json();

    

    if (!res.ok) {
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
