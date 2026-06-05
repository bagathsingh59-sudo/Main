/**
 * Edge middleware — gates the /admin URL space.
 *
 * Edge runtime can't import Node crypto, so this middleware does a
 * *presence* check on the session cookie only. The real HMAC verify
 * runs in the admin layout (Server Component) and the /api/admin/*
 * route handlers (Node runtime). That keeps middleware cheap while
 * still ensuring no unauthenticated request reaches an admin page.
 */

import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "vc_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page + its POST endpoint without a cookie.
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Guard everything else under /admin and /api/admin.
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie && cookie.length > 16) {
    // Looks like a session token. Let the page/route do real verification.
    const res = NextResponse.next();
    // Defense in depth — never let admin pages be indexed.
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // No cookie → API routes get JSON 401, pages get a redirect to login.
  if (isAdminApi) {
    return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
