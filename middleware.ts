import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1-holat: Foydalanuvchi tizimda (tokeni bor)
  if (token) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
  }

  // 2-holat: Foydalanuvchi tizimda emas (tokeni yo'q)
  if (!token) {
    if (pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next|favicon.ico).*)"],
};
