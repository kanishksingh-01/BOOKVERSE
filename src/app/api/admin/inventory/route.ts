import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const lowStockOnly = searchParams.get("lowStock") === "true";

    const where: any = {};
    if (lowStockOnly) {
      where.stock = { lte: 20 };
    }

    const books = await prisma.book.findMany({
      where,
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        stock: true,
        sellingPrice: true,
        coverImage: true,
        category: {
          select: { name: true },
        },
      },
      orderBy: { stock: "asc" },
    });

    return NextResponse.json({ inventory: books });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Admin inventory error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { bookId, newStock } = body;

    if (!bookId || newStock === undefined) {
      return NextResponse.json({ error: "bookId and newStock are required" }, { status: 400 });
    }

    const updated = await prisma.book.update({
      where: { id: bookId },
      data: { stock: Math.max(0, parseInt(newStock, 10)) },
      select: { id: true, title: true, stock: true },
    });

    return NextResponse.json({ message: "Stock updated successfully", book: updated });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.error("Update stock error:", error);
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
