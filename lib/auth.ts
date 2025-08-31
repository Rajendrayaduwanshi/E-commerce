import { signJWT, verifyJWT, JWTPayload } from "@/lib/jwt";
import crypto from "node:crypto";
import { Session } from "@/models/Session";
import type { ObjectId } from "mongoose";

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "30d";

export async function signAccessToken(user: {
  _id: ObjectId;
  role: "user" | "admin";
}) {
  return signJWT(
    {
      sub: String(user._id),
      role: user.role,
      typ: "access",
    },
    ACCESS_TOKEN_TTL
  );
}

export async function signRefreshToken(
  user: { _id: ObjectId; role: "user" | "admin" },
  jti: string
) {
  return signJWT(
    {
      sub: String(user._id),
      role: user.role,
      typ: "refresh",
      jti,
    },
    REFRESH_TOKEN_TTL
  );
}

export async function verifyToken<T = JWTPayload>(token: string) {
  return verifyJWT<T>(token);
}

export async function createSessionAndRefreshToken(
  user: { _id: ObjectId; role: "user" | "admin" },
  meta?: { userAgent?: string; ip?: string }
) {
  const jti = crypto.randomUUID();
  const expiresAt = new Date();

  if (String(REFRESH_TOKEN_TTL).endsWith("d")) {
    expiresAt.setDate(expiresAt.getDate() + parseInt(REFRESH_TOKEN_TTL));
  }

  await Session.create({
    userId: user._id,
    jti,
    userAgent: meta?.userAgent,
    ip: meta?.ip,
    expiresAt,
  });

  const refreshToken = await signRefreshToken(user, jti);
  return { refreshToken, jti, expiresAt };
}

export async function revokeSession(jti: string) {
  await Session.updateOne({ jti }, { $set: { revoked: true } });
}

export async function rotateRefreshToken(
  oldJti: string,
  user: { _id: ObjectId; role: "user" | "admin" },
  meta?: { userAgent?: string; ip?: string }
) {
  await revokeSession(oldJti);
  return await createSessionAndRefreshToken(user, meta);
}
