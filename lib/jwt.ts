import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export type JWTPayload = {
  sub: string;
  role: "user" | "admin";
  typ: "access" | "refresh";
  jti?: string;
};

export async function signJWT(payload: JWTPayload, expiresIn: string) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET);
}

export async function verifyJWT<T = JWTPayload>(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as T;
}
