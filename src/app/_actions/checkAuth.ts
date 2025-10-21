"use server";

import { verifyToken } from "@/util/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const checkAuth = async () => {
  try {
    //! check token
    const token = (await cookies()).get("token")?.value;
    if (!token) redirect("/");

    //! verify token
    const { status, decoded } = await verifyToken(token);

    if (status === "invalid" || decoded.trim() === "") redirect("/");
  } catch (error) {
    console.error(error);
    redirect("/");
  }
};
