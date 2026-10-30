import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();

    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = customers.map((c) => {
      const orderCount = c.orders.length;
      const totalSpent = c.orders
        .filter((o) => o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + o.total, 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        avatar: c.avatar,
        createdAt: c.createdAt,
        orderCount,
        totalSpent,
      };
    });

    return NextResponse.json({ customers: formatted });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Admin customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
