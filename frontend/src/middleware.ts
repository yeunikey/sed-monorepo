import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // Если юзер уже авторизован, но заходит на /auth, редиректим на главную
  if ((token) && (pathname === "/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Если юзер НЕ авторизован и пытается зайти НЕ на /auth, отправляем его на /auth
  if (!token && (pathname != '/auth')) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|logo.png|icons/).*)",
  ],
};