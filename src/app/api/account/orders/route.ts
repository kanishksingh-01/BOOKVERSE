import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: user.id },
          { customerEmail: user.email },
        ],
      },
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const parsedOrders = orders.map((o) => {
      let shippingAddress = {};
      try {
        shippingAddress = JSON.parse(o.shippingAddressJson);
      } catch {}
      return {
        ...o,
        shippingAddress,
      };
    });

    return NextResponse.json({ orders: parsedOrders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
