// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ✅ Protect only authenticated routes
  const protectedRoutes = ["/dashboard", "/profile", "/admin"];
  const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const accessToken =
    req.cookies.get("sb-access-token")?.value ||
    req.headers.get("Authorization")?.replace("Bearer ", "");

  // ✅ No token → logout
  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // ✅ Validate session with DB API
  const verify = await fetch(`${req.nextUrl.origin}/api/admin/verify-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken }),
  });

  if (!verify.ok) {
    // ❌ Session invalid → clear cookies + redirect
    const res = NextResponse.redirect(new URL("/auth/login", req.url));

    res.cookies.delete("sb-access-token");
    res.cookies.delete("sb-refresh-token");

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
