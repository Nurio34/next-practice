"use server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/util/jwt";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";

export const addTodo = async (data: FormData) => {
  const todo = data.get("todo") as string;

  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return console.error("Unauthenticated action");

    const { status, decoded } = await verifyToken(token);
    if (status === "invalid" || !decoded)
      return console.error("Mallformed token");

    const { id, email, role, createdAt } = decoded;
    const user = await prisma.user.findUnique({
      where: { id, email, role, createdAt },
    });
    if (!user) return console.error("Unexisting user");

    const newTodo = await prisma.todo.create({ data: { todo, userId: id } });
    updateTag("todos");
  } catch (error) {
    console.error(error);
  }
};
