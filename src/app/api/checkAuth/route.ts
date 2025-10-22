import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/util/jwt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ isUserReal: false }, { status: 400 });

  try {
    //! verify token
    const { status, decoded } = await verifyToken(token);
    if (status === "invalid" || !decoded)
      return NextResponse.json({ isUserReal: false }, { status: 400 });

    //! check user
    const { id, email, createdAt, role } = decoded;
    const user = await prisma.user.findUnique({
      where: { id, email, createdAt, role },
    });
    if (!user) return NextResponse.json({ isUserReal: false }, { status: 400 });

    return NextResponse.json({ isUserReal: true, id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ isUserReal: false }, { status: 500 });
  }
}
