import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "bookverse-default-super-secret-key-32chars"
);

const COOKIE_NAME = "bookverse_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
