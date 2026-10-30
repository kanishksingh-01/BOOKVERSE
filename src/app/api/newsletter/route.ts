import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = newsletterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0].message }, { status: 400 });
    }

    const email = validated.data.email.toLowerCase().trim();

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    return NextResponse.json({
      message: "Welcome to the BookVerse literary circle! Check your inbox for your 15% welcome code.",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
