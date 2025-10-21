import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, email, createdAt, role } = await request.json();
    console.log({ email });

    const user = await prisma.user.findUnique({
      where: { id, email, createdAt, role },
    });
    console.log(user);
    if (!user) return NextResponse.json({ isUserReal: false }, { status: 200 });

    return NextResponse.json({ isUserReal: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ isUserReal: false }, { status: 200 });
  }
}
