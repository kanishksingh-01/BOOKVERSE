import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const parsed = orders.map((o) => {
      let shippingAddress = {};
      try {
        shippingAddress = JSON.parse(o.shippingAddressJson);
      } catch {}
      return { ...o, shippingAddress };
    });

    return NextResponse.json({ orders: parsed });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Admin fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
