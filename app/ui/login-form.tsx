"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../AppContext";
import Input from "./Input";
import FormLayout from "./form-layout";
function LoginForm() {
  const { updateUser } = useAppContext();
  const router = useRouter();
  const [errors, setErrors] = useState<any[]>([]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resData = await res.json();
    if (resData.statusCode === 200) {
      updateUser(resData.data);
      toast.success("Login Successful");
      router.push("/");
    } else {
      toast.error(resData.message);
      setErrors([...resData.data]);
    }
  }
  return (
    <FormLayout handleSubmit={handleSubmit} className="md:w-3/4 lg:w-1/2">
      <div className="text-white text-4xl text-center font-semibold p-3 ">
        Login to proceed
      </div>
      <div className="error-container flex flex-col w-full text-center text-red-500 gap-4 text-base">
        {errors.map((val: any, ind) => {
          return <span key={ind}>{val.msg}</span>;
        })}
      </div>
      <Input
        label="Email"
        name="email"
        placeholder="Enter your email"
        type="email"
        labelClass="sm:basis-1/3 md:basis-1/4"
        inputClass="sm:basis-2/3 md:basis-3/4"
      />
      <Input
        label="Password"
        name="password"
        placeholder="Enter your password"
        type="password"
        labelClass="sm:basis-1/3 md:basis-1/4"
        inputClass="sm:basis-2/3 md:basis-3/4"
      />
      <div className="self-end cursor-pointer hover:underline  text-white  text-end p-4">
        Don't have Account?{" "}
        <Link href="/register" className="text-blue-400  font-semibold">
          Sign up now
        </Link>
      </div>
      <div className="flex w-full justify-center items-center mt-4">
        <button
          type="submit"
          className=" p-2 basis-1/3 text-center text-base bg-gray-700 font-semibold hover:bg-gray-800 rounded-md"
        >
          Sign in
        </button>
      </div>
    </FormLayout>
  );
}

export default LoginForm;
