import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";

export async function GET(req: NextRequest) {
  await connectDB();
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const token = authHeader?.split(" ")[1];
  try {
    const payload = await verifyToken(token);
    if (payload.typ !== "access") throw new Error("Invalid token");

    const user = await User.findById(payload.sub).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
