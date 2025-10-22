"use server";

import { prisma } from "@/lib/prisma";
import { check } from "@/util/bcrypt";
import { handleCookies } from "@/util/handleCookies";
import { createToken } from "@/util/jwt";

export const login = async (
  data: FormData,
  ip: string
): Promise<{ status: "success" | "fail"; msg: string }> => {
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  if (!email || !password)
    return { status: "fail", msg: "Fill form correct !" };

  try {
    //! check if existing user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { ips: true },
    });
    if (!user) return { status: "fail", msg: "No user with this email" };

    //! check if password true
    const {
      id,
      email: userEmail,
      password: hashedPassword,
      createdAt,
      role,
    } = user;
    const isPasswordTrue = check(password, hashedPassword);
    if (!isPasswordTrue) return { status: "fail", msg: "Wrong password" };

    //! check if the ip in ips
    const { ips } = user;
    const isIpInIps = ips.some((savedIp) => savedIp.ip === ip);
    if (!isIpInIps) return { status: "fail", msg: "Unknown ip usage detected" };
    console.log({ isIpInIps });

    //! create token
    const token = createToken(id, userEmail, createdAt, role, ip);

    //! set cookies
    await handleCookies(token);

    return { status: "success", msg: "Success login" };
  } catch (error) {
    console.error(error);
    return { status: "fail", msg: "Internal error" };
  }
};
