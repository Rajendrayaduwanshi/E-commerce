import { connectDB } from "@/lib/connectDB";
import { Session } from "@/models/Session";
import { verifyToken } from "@/lib/auth";
import { readRefreshCookie, clearRefreshCookie } from "@/lib/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  const token = readRefreshCookie(req);

  if (token) {
    try {
      const payload = await verifyToken(token);

      if (payload.typ === "refresh" && payload.jti) {
        await Session.updateOne(
          { jti: payload.jti },
          { $set: { revoked: true } }
        );
      }
    } catch {
      /* ignore invalid token */
    }
  }

  const response = NextResponse.json({ ok: true });

  clearRefreshCookie(response);

  return response;
}
