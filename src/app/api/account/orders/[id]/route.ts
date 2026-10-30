import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getCurrentUser();

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security check: Only the customer or an admin can view order
    if (user?.role !== "ADMIN" && order.userId && order.userId !== user?.id) {
      if (user && order.customerEmail !== user.email) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    let shippingAddress = {};
    try {
      shippingAddress = JSON.parse(order.shippingAddressJson);
    } catch {}

    return NextResponse.json({
      order: {
        ...order,
        shippingAddress,
      },
    });
  } catch (error) {
    console.error("Fetch order detail error:", error);
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}
