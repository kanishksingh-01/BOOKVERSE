import { getSession } from "./jwt";
import prisma from "@/lib/db/prisma";
import { Role } from "@prisma/client";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      createdAt: true,
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== Role.ADMIN) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
