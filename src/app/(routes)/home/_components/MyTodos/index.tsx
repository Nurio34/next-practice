import { authUser } from "@/app/_actions/authUser";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/util/jwt";
import { cacheTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function MyTodos() {
  const { status, msg, authedUser } = await authUser();
  if (status === "fail" || !authedUser) {
    redirect("/signup");
  }

  console.log(msg);
  const todos = await prisma.todo.findMany({
    where: { userId: authedUser.id },
  });

  return (
    <div>
      <h1 className="font-bold text-2xl">My Todos</h1>
      {todos.map((todo) => {
        return <li key={todo.id}>{todo.todo}</li>;
      })}
    </div>
  );
}
export default MyTodos;
