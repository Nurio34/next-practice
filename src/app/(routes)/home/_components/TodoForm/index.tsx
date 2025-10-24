import { Category } from "@/generated/prisma";
import { addTodo } from "./_actions/addTodo";
import AddTodoButton from "./_components/AddTodoButton";

function TodoForm() {
  const categories: Category[] = ["shop", "hobby", "social"];

  return (
    <div>
      <form
        action={addTodo}
        className="grid gap-y-2 max-w-96 shadow-2xl border-2 py-2 px-4 rounded-lg"
      >
        <h1 className="font-bold text-xl">New Todo</h1>
        <input
          type="text"
          name="todo"
          id="todo"
          placeholder="Add Task..."
          className="border-2 py-1 px-2 rounded-lg"
        />
        <select
          name="category"
          id="category"
          className="border-2 py-1 px-2 rounded-lg"
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <AddTodoButton />
      </form>
    </div>
  );
}
export default TodoForm;
