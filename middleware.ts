import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  // Protected routes require session cookie
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect / to /workspace if logged in
  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/workspace", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/workspace/:path*",
    "/dashboard/:path*",
    "/project/:path*",
    "/settings/:path*",
  ],
};
