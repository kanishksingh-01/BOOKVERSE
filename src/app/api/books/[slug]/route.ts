import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const reviewCount = book.reviews.length;
    const avgRating =
      reviewCount > 0
        ? Number((book.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 4.9;

    const discountPercent =
      book.originalPrice > book.sellingPrice
        ? Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100)
        : 0;

    // Also fetch related books in the same category
    const relatedBooks = await prisma.book.findMany({
      where: {
        categoryId: book.categoryId,
        id: { not: book.id },
      },
      take: 4,
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      book: {
        ...book,
        rating: avgRating,
        reviewCount,
        discountPercent,
      },
      relatedBooks,
    });
  } catch (error) {
    console.error("Fetch book details error:", error);
    return NextResponse.json({ error: "Failed to fetch book details" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin();
    const { slug } = params;
    const body = await req.json();

    const book = await prisma.book.findUnique({ where: { slug } });
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const updated = await prisma.book.update({
      where: { id: book.id },
      data: {
        title: body.title !== undefined ? body.title : book.title,
        author: body.author !== undefined ? body.author : book.author,
        publisher: body.publisher !== undefined ? body.publisher : book.publisher,
        isbn: body.isbn !== undefined ? body.isbn : book.isbn,
        description: body.description !== undefined ? body.description : book.description,
        originalPrice: body.originalPrice !== undefined ? parseInt(body.originalPrice, 10) : book.originalPrice,
        sellingPrice: body.sellingPrice !== undefined ? parseInt(body.sellingPrice, 10) : book.sellingPrice,
        stock: body.stock !== undefined ? parseInt(body.stock, 10) : book.stock,
        pages: body.pages !== undefined ? parseInt(body.pages, 10) : book.pages,
        language: body.language !== undefined ? body.language : book.language,
        coverImage: body.coverImage !== undefined ? body.coverImage : book.coverImage,
        categoryId: body.categoryId !== undefined ? body.categoryId : book.categoryId,
        featured: body.featured !== undefined ? Boolean(body.featured) : book.featured,
        bestseller: body.bestseller !== undefined ? Boolean(body.bestseller) : book.bestseller,
        staffPick: body.staffPick !== undefined ? Boolean(body.staffPick) : book.staffPick,
      },
    });

    return NextResponse.json({ message: "Book updated successfully", book: updated });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    console.error("Update book error:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin();
    const { slug } = params;

    const book = await prisma.book.findUnique({ where: { slug } });
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await prisma.book.delete({ where: { id: book.id } });
    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    console.error("Delete book error:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
