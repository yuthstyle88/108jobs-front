import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { search } = new URL(request.url);

  const fullPath = `/auth/google/callback${search}`;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GOOGLE_BASE_URL}${fullPath}`);

    const data = await response.json();

    if (!response.ok || !data.jwt) {
      return NextResponse.json(
        { error: "Failed to retrieve token from backend" },
        { status: 401 }
      );
    }

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

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
