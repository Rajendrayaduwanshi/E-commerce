import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

const PROTECTED_ROUTES = ["/api/profile", "/dashboard"];
const ADMIN_ROUTES = ["/api/admin", "/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Agar protected ya admin route nahi hai toh aage badhne do
  if (
    !PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) &&
    !ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    return NextResponse.next();
  }

  // Access token header se nikalo
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer") ? authHeader.slice(7) : null;

  // Agar access token hi nahi hai
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyJWT(token);

    if (payload.typ !== "access") throw new Error("Wrong token type");

    // Agar admin route hai aur role admin nahi hai
    if (
      ADMIN_ROUTES.some((r) => pathname.startsWith(r)) &&
      payload.role !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Token sahi hai
    return NextResponse.next();
  } catch (err) {
    console.error("JWT Error", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/admin/:path*"],
};
