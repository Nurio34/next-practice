"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const signup = async (
  data: FormData
): Promise<{ status: "success" | "fail"; msg: string }> => {
  const email = data.get("email") as string;
  const password = data.get("password") as string;
  const confirmPassword = data.get("confirmPassword");

  if (!email || !password || !confirmPassword)
    return { status: "fail", msg: "Fill form correct" };

  if (password !== confirmPassword)
    return { status: "fail", msg: "Passwords dont match" };

  try {
    //! check if same email in db
    const isAnyExistingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (isAnyExistingUser)
      return { status: "fail", msg: "Email already exist!" };

    //! hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    //! create user
    const user = await prisma.user.create({ data: { email, password: hash } });
    const { id, email: userEmail, createdAt } = user;

    //! create token
    const token = jwt.sign(
      { id, email: userEmail, createdAt },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    //! set cookies
    (await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return { status: "success", msg: "Success Signup" };
  } catch (error) {
    console.error(error);
    return { status: "fail", msg: "An internal error" };
  }
};
