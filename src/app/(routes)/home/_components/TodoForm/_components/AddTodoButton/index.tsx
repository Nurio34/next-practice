"use client";

import { useFormState, useFormStatus } from "react-dom";

function AddTodoButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Adding..." : "Add Todo"}
    </button>
  );
}
export default AddTodoButton;
