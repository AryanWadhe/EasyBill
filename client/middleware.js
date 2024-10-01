import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const authPaths = ["/login", "/register"];
export default async function middleware(request) {
  const token = cookies().get("accessToken");
  const pathname = request.nextUrl.pathname;
  if (authPaths.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (pathname.startsWith("/invoice/")) {
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
