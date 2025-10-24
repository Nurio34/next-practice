import { cookies, headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

const protectedRoutes = ["/home"];
const unprotectedRoutes = ["/", "/signup", "/login"];

export default async function proxy(request: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  const route = request.nextUrl.pathname;

  if (unprotectedRoutes.includes(route)) {
    if (token) return NextResponse.redirect(new URL("/home", request.url));
  } else if (protectedRoutes.includes(route)) {
    if (!token) return NextResponse.redirect(new URL("/signup", request.url));
  }

  //   return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  //   matcher: "/home",
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
