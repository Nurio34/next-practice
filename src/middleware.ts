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
  limiter: Ratelimit.fixedWindow(1, "10s"),
  analytics: true,
});

export async function middleware(request: NextRequest) {
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
  const checkIsUserReal = await fetch("http://localhost:3000/api/checkAuth", {
    method: "POST",
    headers: {
      authentication: `Bearer ${token}`,
    },
  });
  const { isUserReal, id } = await checkIsUserReal.json();
  console.log({ isUserReal, id, ip: request.headers.get("x-forwarded-for") });

  if (!isUserReal)
    return NextResponse.redirect(new URL("/signup", request.url));
  //! ********************************************************************
  //** ---------------------------------------------------------------------- */

  //! *** Rate Limiter ***
  const { success, reset, remaining } = await limiter.limit(id);

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
  //! ********************
  return NextResponse.next();
}

export const config = {
  matcher: "/home",
};
