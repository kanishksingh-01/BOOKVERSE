import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guard";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      sortOrder: cat.sortOrder,
      bookCount: cat._count.books,
    }));

    return NextResponse.json({ categories: formatted });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { name, description, image, sortOrder } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = slugify(name);

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || "",
        image: image || null,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      },
    });

    return NextResponse.json({ message: "Category created", category }, { status: 201 });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
