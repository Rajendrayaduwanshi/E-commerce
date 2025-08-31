import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { Session } from "@/models/Session";
import { verifyToken, rotateRefreshToken, signAccessToken } from "@/lib/auth";
import { setRefreshCookie, readRefreshCookie } from "@/lib/cookies";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();

  const token = readRefreshCookie(req);
  if (!token)
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 401 }
    );

  try {
    const payload = await verifyToken(token);
    if (payload.typ !== "refresh" || !payload.jti) {
      throw new Error("Bad token");
    }

    const session = await Session.findOne({ jti: payload.jti });
    if (!session || session.revoked || new Date() > session.expiresAt) {
      return NextResponse.json({ error: "Refresh invalid" }, { status: 401 });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // rotate old session + issue new refresh token
    const { refreshToken, expiresAt } = await rotateRefreshToken(
      payload.jti,
      user,
      {
        userAgent: req.headers.get("user-agent") || "",
        ip,
      }
    );

    // create fresh access token
    const accessToken = await signAccessToken(user);

    const response = NextResponse.json({ accessToken });
    setRefreshCookie(response, refreshToken, expiresAt);

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
