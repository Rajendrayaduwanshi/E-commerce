import { SignJWT, jwtVerify } from "jose";
import crypto from "node:crypto";
import { Session } from "@/models/Session";
import type { ObjectId } from "mongoose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "30d";

type JWTPayload = {
  sub: string;
  role: "user" | "admin";
  jti?: string;
  typ: "access" | "refresh";
};

export async function signAccessToken(user: {
  _id: ObjectId;
  role: "user" | "admin";
}) {
  const payload: JWTPayload = {
    sub: String(user._id),
    role: user.role,
    typ: "access",
  };
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(SECRET);
}

export async function signRefreshToken(
  user: { _id: ObjectId; role: "user" | "admin" },
  jti: string
) {
  const payload: JWTPayload = {
    sub: String(user._id),
    role: user.role,
    jti,
    typ: "refresh",
  };
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(SECRET);
}

export async function verifyToken<T = JWTPayload>(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as T;
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
