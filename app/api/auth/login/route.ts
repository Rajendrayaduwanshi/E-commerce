import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import { verifyPassword } from "@/lib/password";
import { signAccessToken, createSessionAndRefreshToken } from "@/lib/auth";
import { setRefreshCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  // 1. User check
  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // 2. Password verify (schema me "password" field hai, not passwordHash)
  const ok = await verifyPassword(password, user.password);
  if (!ok)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // 3. Access token banao
  const accessToken = await signAccessToken(user);

  // 4. Refresh token banao + session save karo
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { refreshToken, expiresAt } = await createSessionAndRefreshToken(user, {
    userAgent: req.headers.get("user-agent") || "",
    ip,
  });

  // 5. Response with cookie
  const response = NextResponse.json({
    accessToken,
    user: {
      id: String(user._id),
      role: user.role,
      email: user.email,
      name: user.name,
    },
  });

  setRefreshCookie(response, refreshToken, expiresAt);

  return response;
}
