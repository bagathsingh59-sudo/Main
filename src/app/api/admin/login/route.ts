import { NextResponse } from "next/server";
import { ADMIN_COOKIE, signSession, verifyPassword } from "@/services/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Bad request" }, { status: 400 });
  }

  // Constant-time delay against trivial timing/brute attempts.
  await new Promise((r) => setTimeout(r, 400));

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { ok: false, message: "Invalid password" },
      { status: 401 },
    );
  }

  const token = signSession();
  if (!token) {
    return NextResponse.json(
      { ok: false, message: "ADMIN_SESSION_SECRET not configured" },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE.name,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ADMIN_COOKIE.ttlMs / 1000),
  });
  return res;
}
