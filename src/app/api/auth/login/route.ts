import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";
import { signSessionToken, setSessionCookie } from "@/lib/auth/jwt";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
