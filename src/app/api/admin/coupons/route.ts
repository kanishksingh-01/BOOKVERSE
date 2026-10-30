import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ coupons });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Admin coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      validUntil,
    } = body;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: "Missing required coupon details" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        description: description || "",
        discountType,
        discountValue: parseInt(discountValue, 10),
        minOrderAmount: minOrderAmount ? parseInt(minOrderAmount, 10) : 0,
        maxDiscountAmount: maxDiscountAmount ? parseInt(maxDiscountAmount, 10) : null,
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ message: "Coupon created", coupon }, { status: 201 });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Create coupon error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
