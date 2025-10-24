import { Role } from "@/generated/prisma";
import { verifyToken } from "@/util/jwt";
import { cookies } from "next/headers";

export interface UserType {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export const authUser = async (): Promise<{
  status: "success" | "fail";
  msg: string;
  authedUser?: UserType;
}> => {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return { status: "fail", msg: "No token" };

    const { status, decoded } = await verifyToken(token);
    if (status === "invalid" || !decoded)
      return { status: "fail", msg: "Mallformed token" };

    const { id, email, role, createdAt } = decoded;

    return {
      status: "success",
      msg: "Success authUser",
      authedUser: { id, email, role, createdAt },
    };
  } catch (error) {
    console.error(error);
    return { status: "fail", msg: "Server error at authUser" };
  }
};
