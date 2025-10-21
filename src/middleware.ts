import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "./util/jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //! check if any token in cookies
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/signup", request.url));

  const { status, decoded } = await verifyToken(token);
  if (status === "invalid" || !decoded)
    return NextResponse.redirect(new URL("/signup", request.url));

  // //! send token to api/checkAuth/route to check if the user a valid user
  const checkIsUserReal = await fetch("http://localhost:3000/api/checkAuth", {
    method: "POST",
    body: JSON.stringify(decoded),
  });
  const { isUserReal } = await checkIsUserReal.json();
  console.log({ isUserReal });

  if (!isUserReal)
    return NextResponse.redirect(new URL("/signup", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: "/home",
};
