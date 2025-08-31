import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || "rt";

export async function setRefreshCookie(
  response: NextResponse,
  token: string,
  expires: Date
) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires,
  });
}

export async function clearRefreshCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });
}

export function readRefreshCookie(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_NAME);
  return cookie?.value || "";
}
