import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { z } from "zod";

const verifySchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = verifySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid payment verification data" },
        { status: 400 }
      );
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      validated.data;

    // Verify order existence
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
        orderId: order.id,
      });
    }

    // Verify HMAC SHA-256 signature
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      // Mark as failed
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });

      return NextResponse.json(
        { error: "Payment verification failed. Invalid digital signature." },
        { status: 400 }
      );
    }

    // Execute atomic transaction: Update Order, Record Payment, Decrement Book Stock
    await prisma.$transaction(async (tx) => {
      // 1. Update order
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
          razorpayPaymentId,
        },
      });

      // 2. Create Payment record
      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: "RAZORPAY",
          transactionId: razorpayPaymentId,
          signature: razorpaySignature,
          amount: order.total,
          currency: "INR",
          status: "PAID",
          rawResponse: JSON.stringify({
            razorpayOrderId,
            razorpayPaymentId,
          }),
        },
      });

      // 3. Decrement inventory stock safely
      for (const item of order.items) {
        if (item.bookId) {
          await tx.book.update({
            where: { id: item.bookId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order confirmed!",
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}
