"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "../../_actions/login";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // ✅ gets all inputs from the form

    try {
      setIsLoading(true);
      const { status, msg } = await login(formData);
      if (status === "success") {
        console.log(msg);
        router.push("/home");
      } else {
        console.error(msg);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-96 border-2 grid gap-y-2  py-4 pl-2 pr-8"
    >
      <h1 className="justify-self-center text-xl font-bold">Login</h1>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        defaultValue={"nurioonsoftware@gmail.com"}
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        defaultValue={"12"}
      />
      <button type="submit" className="btn btn-primary">
        {isLoading ? (
          <div className="flex items-center gap-x-1">
            <span>Loging</span>
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <span>Login</span>
        )}
      </button>
      <Link
        href={"/signup"}
        className="text-primary font-semibold text-sm justify-self-end"
      >
        Signup
      </Link>
    </form>
  );
}
export default LoginForm;
