import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalOrders,
      totalCustomers,
      totalBooks,
      lowStockBooks,
      recentOrders,
      allPaidOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.book.count(),
      prisma.book.findMany({
        where: { stock: { lte: 15 } },
        select: {
          id: true,
          title: true,
          stock: true,
          sellingPrice: true,
          coverImage: true,
        },
        take: 8,
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      }),
      prisma.order.findMany({
        where: { paymentStatus: "PAID" },
        select: { total: true, createdAt: true },
      }),
    ]);

    const totalSales = allPaidOrders.reduce((sum, o) => sum + o.total, 0);

    const parsedRecentOrders = recentOrders.map((o) => {
      let shippingAddress = {};
      try {
        shippingAddress = JSON.parse(o.shippingAddressJson);
      } catch {}
      return { ...o, shippingAddress };
    });

    return NextResponse.json({
      metrics: {
        totalSales,
        totalOrders,
        totalCustomers,
        totalBooks,
        lowStockCount: lowStockBooks.length,
      },
      lowStockBooks,
      recentOrders: parsedRecentOrders,
    });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Admin metrics error:", error);
    return NextResponse.json({ error: "Failed to load metrics" }, { status: 500 });
  }
}
