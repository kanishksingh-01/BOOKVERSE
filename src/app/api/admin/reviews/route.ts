import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();

    const reviews = await prisma.review.findMany({
      include: {
        book: {
          select: { title: true, coverImage: true, slug: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Admin reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { reviewId, isApproved } = body;

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: Boolean(isApproved) },
    });

    return NextResponse.json({ message: "Review updated", review: updated });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Moderate review error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Delete review error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
