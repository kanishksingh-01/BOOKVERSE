import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/guard";
import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  street: z.string().min(3),
  landmark: z.string().optional().nullable(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(6),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = addressSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { isDefault, ...data } = validated.data;

    if (isDefault) {
      // Unset previous default
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...data,
        isDefault,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Address saved", address }, { status: 201 });
  } catch (error) {
    console.error("Save address error:", error);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}
