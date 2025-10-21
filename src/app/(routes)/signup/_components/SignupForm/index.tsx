"use client";

import { FormEvent, useState } from "react";
import { signup } from "../../_actions/signup";
import { useRouter } from "next/navigation";
import Link from "next/link";

function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // ✅ gets all inputs from the form

    try {
      setIsLoading(true);
      const { status, msg } = await signup(formData);
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
      <h1 className="justify-self-center text-xl font-bold">Signup</h1>
      <input type="email" name="email" id="email" placeholder="Email" />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
      />
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm Password"
      />
      <button type="submit" className="btn btn-primary">
        {isLoading ? (
          <div className="flex items-center gap-x-1">
            <span>Signing</span>
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <span>Signup</span>
        )}
      </button>
      <Link
        href={"/login"}
        className="text-primary font-semibold text-sm justify-self-end"
      >
        Login
      </Link>
    </form>
  );
}
export default SignupForm;
