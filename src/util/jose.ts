import { JWTPayload, jwtVerify } from "jose";

export const verifyToken = async (
  token: string
): Promise<{ status: "valid" | "invalid"; decoded: JWTPayload | null }> => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return { status: "valid", decoded: payload };
  } catch (error) {
    console.error(error);

    return { status: "invalid", decoded: null };
  }
};
