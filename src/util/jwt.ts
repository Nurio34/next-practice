import { $Enums } from "@/generated/prisma";
import { JWTPayload } from "jose";
import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  id: string,
  email: string,
  createdAt: Date,
  role: $Enums.Role,
  ip: string
): string => {
  const token = jwt.sign(
    { id, email, createdAt, role, ip },
    process.env.JWT_SECRET!,
    {
      expiresIn: "10s",
    }
  );

  return token;
};

export const verifyToken = async (
  token: string
): Promise<{
  status: "valid" | "invalid";
  decoded: null | JwtPayload;
}> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return { status: "valid", decoded: decoded as JWTPayload };
  } catch (error) {
    console.error(error);
    return { status: "invalid", decoded: null };
  }
};
