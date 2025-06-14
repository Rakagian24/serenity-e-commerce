import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;
  const response = NextResponse.next();

  // Admin route protection
  if (url.pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // General auth protection
  const protectedRoutes = ["/cart", "/checkout", "/orders", "/profile"];
  if (protectedRoutes.some((path) => url.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/api/midtrans/callback')) {
    return;
  }

  // ✅ Tambahkan CSP hanya untuk halaman /checkout
  if (url.pathname === "/checkout") {
    response.headers.set(
      "Content-Security-Policy",
      "script-src 'self' 'unsafe-eval' https://app.sandbox.midtrans.com https://*.midtrans.com; object-src 'none';"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cart",
    "/checkout",
    "/orders/:path*",
    "/profile",
  ],
};
