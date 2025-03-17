import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { search } = new URL(request.url);

  // Tạo URL đầy đủ với toàn bộ query string
  const fullPath = `/auth/google/callback${search}`;

  console.log(`https://fastwork.ibrowe.com${fullPath}`);
  

  try {
    // Gửi toàn bộ query string tới backend
    const response = await fetch(`https://fastwork.ibrowe.com${fullPath}`);

    const data = await response.json();

    if (!response.ok || !data.jwt) {
      return NextResponse.json(
        { error: "Failed to retrieve token from backend" },
        { status: 401 }
      );
    }

    // Dùng token để tạo session qua NextAuth.js
    const result = await signIn("credentials", {
      token: data.jwt,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
