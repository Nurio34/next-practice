import { Suspense } from "react";
import TodoForm from "./_components/TodoForm";
import Todos from "./_components/Todos";

async function HomePage() {
  return (
    <div className="space-y-4 py-4 px-8">
      <h1 className="font-bold text-primary text-4xl">HomePage</h1>
      <Suspense>
        <Todos />
      </Suspense>
      <TodoForm />
    </div>
  );
}
export default HomePage;
