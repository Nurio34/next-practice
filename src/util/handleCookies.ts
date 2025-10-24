import { cookies } from "next/headers";

export const handleCookies = async (token: string) => {
  try {
    (await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 10, // 1 hour
    });
  } catch (error) {
    console.error(error);
  }
};
