import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, email, password } = await req.json();

  // Validation
  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Name, email & password required" },
      { status: 400 }
    );
  }

  // Duplicate check
  const existUser = await User.findOne({ email });
  if (existUser) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );
  }

  // Password hash
  const hashed = await hashPassword(password);

  // User create
  const user = await User.create({
    name,
    email,
    password: hashed, // schema ke field ka naam "password" hai
    role: "user",
  });

  return NextResponse.json({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
