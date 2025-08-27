import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/password";
import { signAccessToken, createSessionAndRefreshToken } from "@/lib/auth";
import { setRefreshCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const accessToken = await signAccessToken(user);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { refreshToken, expiresAt } = await createSessionAndRefreshToken(user, {
    userAgent: req.headers.get("user-agent") || "",
    ip,
  });

  const response = NextResponse.json({
    accessToken,
    user: { id: String(user._id), role: user.role, email: user.email },
  });

  setRefreshCookie(response, refreshToken, expiresAt);

  return response;
}
