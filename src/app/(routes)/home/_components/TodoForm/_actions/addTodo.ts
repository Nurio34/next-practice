"use server";

import { authUser } from "@/app/_actions/authUser";
import { Category } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export const addTodo = async (data: FormData): Promise<void> => {
  const todo = data.get("todo") as string;
  const category = data.get("category") as Category;
  if (todo.trim() === "" || category.trim() === "")
    return console.error("Invalid todo");

  try {
    const { status, msg, authedUser } = await authUser();
    if (status === "fail" || !authedUser) {
      console.error(msg);
      redirect("/signup");
    }

    const user = await prisma.user.findUnique({
      where: authedUser,
    });
    if (!user) return console.error("Unexisting user");

    const newTodo = await prisma.todo.create({
      data: { todo, userId: user.id, category },
    });
    updateTag("todos");
    return console.log("Success addTodo");
  } catch (error) {
    console.error(error);
    return console.error("Server error at addTodo");
  }
};
