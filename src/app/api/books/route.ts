import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guard";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const minPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!, 10) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!, 10) : undefined;
    const inStock = searchParams.get("inStock") === "true";
    const featured = searchParams.get("featured") === "true";
    const bestseller = searchParams.get("bestseller") === "true";
    const staffPick = searchParams.get("staffPick") === "true";
    const sortBy = searchParams.get("sortBy") || "popularity";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { isbn: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "all") {
      where.category = {
        slug: category,
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.sellingPrice = {};
      if (minPrice !== undefined) where.sellingPrice.gte = minPrice;
      if (maxPrice !== undefined) where.sellingPrice.lte = maxPrice;
    }

    if (inStock) {
      where.stock = { gt: 0 };
    }

    if (featured) where.featured = true;
    if (bestseller) where.bestseller = true;
    if (staffPick) where.staffPick = true;

    // Sorting
    let orderBy: Prisma.BookOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "price-asc") {
      orderBy = { sellingPrice: "asc" };
    } else if (sortBy === "price-desc") {
      orderBy = { sellingPrice: "desc" };
    } else if (sortBy === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sortBy === "popularity") {
      orderBy = { bestseller: "desc" };
    }

    const [total, books] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          reviews: {
            where: { isApproved: true },
            select: { rating: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const formattedBooks = books.map((book) => {
      const reviewCount = book.reviews.length;
      const avgRating =
        reviewCount > 0
          ? Number((book.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
          : 4.8; // default editorial curated rating if unreviewed

      const discountPercent =
        book.originalPrice > book.sellingPrice
          ? Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100)
          : 0;

      return {
        ...book,
        rating: avgRating,
        reviewCount,
        discountPercent,
      };
    });

    return NextResponse.json({
      books: formattedBooks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch books error:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const {
      title,
      author,
      publisher,
      isbn,
      description,
      originalPrice,
      sellingPrice,
      stock,
      pages,
      language,
      coverImage,
      categoryId,
      featured,
      bestseller,
      staffPick,
    } = body;

    if (!title || !author || !isbn || !categoryId || !originalPrice || !sellingPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.book.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const book = await prisma.book.create({
      data: {
        title,
        slug,
        author,
        publisher: publisher || "Independent Press",
        isbn,
        description: description || "",
        originalPrice: parseInt(originalPrice, 10),
        sellingPrice: parseInt(sellingPrice, 10),
        stock: parseInt(stock, 10) || 0,
        pages: parseInt(pages, 10) || 200,
        language: language || "English",
        coverImage: coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
        categoryId,
        featured: Boolean(featured),
        bestseller: Boolean(bestseller),
        staffPick: Boolean(staffPick),
      },
    });

    return NextResponse.json({ message: "Book created successfully", book }, { status: 201 });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    console.error("Create book error:", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
