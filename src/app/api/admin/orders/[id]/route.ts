import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;

    // If order is cancelled or refunded, restore stock if was previously confirmed
    if (status === "CANCELLED" && existing.status !== "CANCELLED") {
      for (const item of existing.items) {
        if (item.bookId) {
          await prisma.book.update({
            where: { id: item.bookId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Order updated successfully",
      order: updated,
    });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Admin update order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
