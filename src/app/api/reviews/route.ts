import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/guard";
import { z } from "zod";

const reviewSchema = z.object({
  bookId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2, "Review title is required"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to write a review" }, { status: 401 });
    }

    const body = await req.json();
    const validated = reviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0].message }, { status: 400 });
    }

    const { bookId, rating, title, comment } = validated.data;

    // Check if user has an order with this book
    const verifiedOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
        items: {
          some: { bookId },
        },
      },
    });

    const review = await prisma.review.create({
      data: {
        bookId,
        userId: user.id,
        rating,
        title,
        comment,
        verifiedPurchase: Boolean(verifiedOrder),
        isApproved: true,
      },
    });

    return NextResponse.json(
      { message: "Thank you! Your review has been published.", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
