import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/util/jwt";
import { cacheTag } from "next/cache";
import { cookies } from "next/headers";

// async function Todos() {
//   cacheTag("todos");
//   const todos = await prisma.todo.findMany();
//   return (
//     <div>
//       {todos.map((todo) => {
//         return <li key={todo.id}>{todo.todo}</li>;
//       })}
//     </div>
//   );
// }
// export default Todos;

async function Todos() {
  const token = (await cookies()).get("token")?.value;
  const { decoded } = await verifyToken(token!);
  const todos = await prisma.todo.findMany({ where: { userId: decoded!.id } });

  return (
    <div>
      {todos.map((todo) => {
        return <li key={todo.id}>{todo.todo}</li>;
      })}
    </div>
  );
}
export default Todos;
