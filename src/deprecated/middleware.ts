import { NextResponse, NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

//! *** Rate Limit Configs ***
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
});

//! define routes
const unauthRoutes = ["/", "/signup", "/login"];
const protectedRoutes = ["/home"];

export async function middleware(request: NextRequest) {
  console.log("middleware working...");

  const path = request.nextUrl.pathname;

  try {
    if (unauthRoutes.includes(path)) {
      const ip =
        // @ts-expect-error - ip is available in Edge runtime
        request.ip ??
        request.headers.get("x-forwarded-for")?.split(",")[0] ??
        "unknown";

      //! rate limit
      const { success, reset, remaining } = await limiter.limit(`ip_${ip}`);
      if (!success) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests", reset }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Remaining": String(remaining),
              "X-RateLimit-Reset": String(reset),
            },
          }
        );
      }
    }

    if (protectedRoutes.includes(path)) {
      //! *** check if any token in cookies ***
      const token = request.cookies.get("token")?.value;
      if (!token) return NextResponse.redirect(new URL("/signup", request.url));

      //** ---------------------------------------------------------------------- */
      //** Eighter only verify token inside middleware(edge) with jose */
      //** or make a fetch call to api to verify token and check user in db (node) */
      // //! *** verify token with jose ***
      // const { status, decoded } = await verifyToken(token);
      // if (status === "invalid" || !decoded)
      //   return NextResponse.redirect(new URL("/signup", request.url));
      // //! ******************************

      //! *** send token to api to verify and check if user is real ***
      const checkIsUserReal = await fetch(
        `${process.env.SITE_URL}/api/checkAuth`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { isUserReal, id } = await checkIsUserReal.json();

      if (!isUserReal)
        return NextResponse.redirect(new URL("/signup", request.url));
      //! ********************************************************************
      //** ---------------------------------------------------------------------- */

      //! rate limit
      const { success, reset, remaining } = await limiter.limit(`user_${id}`);
      if (!success) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests", reset }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Remaining": String(remaining),
              "X-RateLimit-Reset": String(reset),
            },
          }
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/signup", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
