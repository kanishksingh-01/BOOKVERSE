import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();
    const subtotal = parseInt(searchParams.get("subtotal") || "0", 10);

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { error: "Invalid or expired coupon code" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json(
        { error: "This coupon is no longer valid" },
        { status: 400 }
      );
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: "This coupon has reached its maximum usage limit" },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minOrderAmount) {
      const minINR = Math.round(coupon.minOrderAmount / 100);
      return NextResponse.json(
        { error: `This coupon requires a minimum cart value of ₹${minINR}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
