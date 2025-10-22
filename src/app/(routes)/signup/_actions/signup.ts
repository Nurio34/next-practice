"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "@/util/bcrypt";
import { handleCookies } from "@/util/handleCookies";
import { createToken } from "@/util/jwt";

export const signup = async (
  data: FormData,
  ip: string
): Promise<{ status: "success" | "fail"; msg: string }> => {
  const email = data.get("email") as string;
  const password = data.get("password") as string;
  const confirmPassword = data.get("confirmPassword");

  if (!email || !password || !confirmPassword)
    return { status: "fail", msg: "Fill form correct" };

  if (password !== confirmPassword)
    return { status: "fail", msg: "Passwords dont match" };

  if (!ip || ip.trim() === "")
    return { status: "fail", msg: "No ip detected !" };

  try {
    //! check if same email in db
    const isAnyExistingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (isAnyExistingUser)
      return { status: "fail", msg: "Email already exist!" };

    //! hash password
    const hashPassword = hash(password);

    //! create user
    const user = await prisma.user.create({
      data: { email, password: hashPassword },
    });
    const userIP = await prisma.userIP.create({
      data: { userId: user.id, ip },
    });
    const { id, email: userEmail, createdAt, role } = user;
    const { ip: savedIp } = userIP;

    //! create token
    const token = createToken(id, userEmail, createdAt, role, savedIp);

    //! set cookies
    await handleCookies(token);

    return { status: "success", msg: "Success Signup" };
  } catch (error) {
    console.error(error);
    return { status: "fail", msg: "An internal error" };
  }
};
