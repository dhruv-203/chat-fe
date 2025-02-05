import LoginForm from "../ui/login-form";

function Page() {
  return (
    <div className="w-full h-dvh bg-[url(/OIP.jpg)] bg-cover bg-[center_right]">
      <div className="container w-full h-full mx-auto flex items-center p-4 space-y-8 ">
        <LoginForm />
      </div>
    </div>
  );
}

export default Page;
