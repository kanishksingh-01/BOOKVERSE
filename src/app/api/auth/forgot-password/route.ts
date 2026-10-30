import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = forgotSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validated.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Even if user does not exist, return success to prevent email enumeration
    return NextResponse.json({
      message:
        "If an account with that email exists, we have sent instructions to reset your password.",
      demoNote: user
        ? "For testing purposes, password reset token has been registered in the system."
        : null,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}
