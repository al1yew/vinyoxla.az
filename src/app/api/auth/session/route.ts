import { NextResponse, type NextRequest } from "next/server";
import { authCookieName, phoneCookieName } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token?: string; phone?: string };

  if (!body.token || !body.phone) {
    return NextResponse.json({ message: "Missing token or phone" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(authCookieName, body.token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  response.cookies.set(phoneCookieName, encodeURIComponent(body.phone), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(authCookieName, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0
  });

  response.cookies.set(phoneCookieName, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0
  });

  return response;
}
