import { addTodo } from "./_actions/addTodo";

function TodoForm() {
  return (
    <div>
      <form action={addTodo}>
        <h1 className="font-bold text-xl">New Todo</h1>
        <input
          type="text"
          name="todo"
          id="todo"
          placeholder="Add Task..."
          className="border-2 py-1 px-2 rounded-lg"
        />
      </form>
    </div>
  );
}
export default TodoForm;
