import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email & password required" },
      { status: 400 }
    );
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash, role: "user" });

  return NextResponse.json({
    user: { id: String(user._id), email: user.email, role: user.role },
  });
}
