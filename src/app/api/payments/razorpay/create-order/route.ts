import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/guard";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { z } from "zod";

const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    street: z.string(),
    landmark: z.string().optional().nullable(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default("India"),
  }),
  items: z.array(
    z.object({
      bookId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  couponCode: z.string().optional().nullable(),
  paymentMethod: z.enum(["RAZORPAY", "COD"]).default("RAZORPAY"),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const validated = createOrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      couponCode,
      paymentMethod,
    } = validated.data;

    // Validate books and recalculate all prices server-side
    const bookIds = items.map((i) => i.bookId);
    const dbBooks = await prisma.book.findMany({
      where: { id: { in: bookIds } },
    });

    if (dbBooks.length !== items.length) {
      return NextResponse.json(
        { error: "One or more books in your cart could not be found" },
        { status: 400 }
      );
    }

    // Check stock
    for (const item of items) {
      const book = dbBooks.find((b) => b.id === item.bookId);
      if (!book || book.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `"${book?.title || 'A book'}" is out of stock or does not have ${item.quantity} copies available.`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const book = dbBooks.find((b) => b.id === item.bookId)!;
      const itemTotal = book.sellingPrice * item.quantity;
      subtotal += itemTotal;
      return {
        bookId: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        price: book.sellingPrice,
        quantity: item.quantity,
      };
    });

    // Calculate coupon discount
    let discount = 0;
    let validCouponId: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (
        coupon &&
        coupon.isActive &&
        new Date() >= coupon.validFrom &&
        new Date() <= coupon.validUntil &&
        coupon.usedCount < coupon.maxUses &&
        subtotal >= coupon.minOrderAmount
      ) {
        validCouponId = coupon.id;
        if (coupon.discountType === "PERCENTAGE") {
          const calc = Math.round((subtotal * coupon.discountValue) / 100);
          discount = coupon.maxDiscountAmount
            ? Math.min(calc, coupon.maxDiscountAmount)
            : calc;
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    // Shipping: Free above ₹499 (49900 paise), else ₹49 (4900 paise)
    const shippingFee = subtotal >= 49900 ? 0 : 4900;
    const total = Math.max(0, subtotal - discount + shippingFee);

    // Generate readable orderNumber: BV-YYYY-RANDOM
    const orderNumber = `BV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create database order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user?.id || null,
        customerName,
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone,
        shippingAddressJson: JSON.stringify(shippingAddress),
        subtotal,
        discount,
        shippingFee,
        total,
        status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: paymentMethod === "COD" ? "COD" : "RAZORPAY",
        items: {
          create: orderItemsData,
        },
      },
    });

    // If COD, decrement stock immediately and return
    if (paymentMethod === "COD") {
      for (const item of items) {
        await prisma.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (validCouponId) {
        await prisma.couponUsage.create({
          data: {
            couponId: validCouponId,
            userId: user?.id || null,
            orderId: order.id,
            discountApplied: discount,
          },
        });
        await prisma.coupon.update({
          where: { id: validCouponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod: "COD",
        redirectUrl: `/account/orders/${order.id}`,
      });
    }

    // For Razorpay: Create razorpay order
    const rzpOrder = await createRazorpayOrder(total, order.orderNumber);

    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpOrder.id },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: total,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_BookVerse2026",
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout order" },
      { status: 500 }
    );
  }
}
