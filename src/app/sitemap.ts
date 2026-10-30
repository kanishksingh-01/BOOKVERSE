import { MetadataRoute } from "next";
import prisma from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bookverse.in";

  // Static routes
  const routes = ["", "/shop", "/about", "/contact", "/login", "/register"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    })
  );

  // Dynamic book routes
  let bookRoutes: any[] = [];
  let categoryRoutes: any[] = [];

  try {
    const books = await prisma.book.findMany({
      select: { slug: true, updatedAt: true },
    });

    bookRoutes = books.map((book) => ({
      url: `${baseUrl}/books/${book.slug}`,
      lastModified: book.updatedAt.toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

    // Dynamic category routes
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: cat.updatedAt.toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (e) {
    // Graceful fallback during isolated builds
  }

  return [...routes, ...bookRoutes, ...categoryRoutes];
}
