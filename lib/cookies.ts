import { NextResponse } from "next/server";

const COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || "rt";

export async function setRefreshCookie(
  response: NextResponse,
  token: string,
  expires: Date
) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires,
  });
}

export async function clearRefreshCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(0),
  });
}

export async function readRefreshCookie(req: Request) {
  const cookie = (req as any).cookies?.get(COOKIE_NAME);
  return cookie?.value || "";
}
