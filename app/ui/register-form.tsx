"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import FormLayout from "./form-layout";
import Input from "./Input";

function RegisterForm() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setErrors([{ msg: "Passwords do not match" }]);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
          gender: formData.get("gender"),
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await res.json();

      if (resData.statusCode === 200) {
        toast.success("Registration Successful");
        router.replace("/"); // Use replace instead of push
      } else {
        toast.error(resData.message);
        setErrors(resData.data);
      }
    } catch (error) {
      toast.error("Registration failed");
      console.error(error);
    }
  };
  const [errors, setErrors] = useState<any[]>([]);

  return (
    <FormLayout
      handleSubmit={handleSubmit}
      className={"sm:w-full xl:w-3/5 lg:w-3/4  max-h-[90vh] "}
    >
      <div className="sticky top-0 w-full">
        <div className="text-white text-4xl text-center font-semibold p-3">
          Register to proceed
        </div>
        <div className="error-container flex flex-col w-full text-center text-red-500 gap-4 text-base">
          {errors &&
            errors.map((val: any, ind) => {
              return <span key={ind}>{val.msg}</span>;
            })}
        </div>
      </div>
      <div className="w-full flex flex-col gap-6 overflow-y-auto">
        <Input
          label="Name"
          name="name"
          placeholder="Enter your name"
          type="text"
          labelClass="sm:basis-1/3 md:basis-1/4"
          inputClass="sm:basis-2/3 md:basis-3/4"
        />
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
        <Input
          label="Retype Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          type="password"
          labelClass="sm:basis-1/3 md:basis-1/4"
          inputClass="sm:basis-2/3 md:basis-3/4"
        />
        <div className="w-full flex  flex-col sm:flex-row justify-center gap-4 items-center mt-4">
          <div className="text-start  w-full max-w-[400px]  px-4 py-2 text-base font-semibold sm:basis-1/3 md:basis-1/4">
            Select Gender
          </div>
          <div className="px-4 py-2 flex justify-start items-center gap-10 w-full max-w-[400px] text-center text-base rounded-md sm:basis-2/3 md:basis-3/4">
            <div className="flex gap-2 justify-center items-center ">
              <input
                type="radio"
                name="gender"
                value="MALE"
                id="male"
                className="w-6 h-6 p-3 cursor-pointer accent-slate-900"
              />
              <label htmlFor="male" className="text-center text-base px-4 py-2">
                Male
              </label>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                id="female"
                className="w-6 h-6 p-3 cursor-pointer accent-slate-900"
              />
              <label
                htmlFor="female"
                className="text-center text-base px-4 py-2"
              >
                Female
              </label>
            </div>
          </div>
        </div>
        <div className="self-center cursor-pointer hover:underline  text-white  text-end px-4">
          Already have Account?{" "}
          <Link href="/login" className="text-blue-400  font-semibold">
            Sign in now
          </Link>
        </div>
        <div className="flex w-full justify-center items-center mt-4">
          <button
            type="submit"
            className=" p-2 basis-1/3 text-center text-base bg-gray-700 font-semibold hover:bg-gray-800 rounded-md"
          >
            Sign up
          </button>
        </div>
      </div>
    </FormLayout>
  );
}

export default RegisterForm;
