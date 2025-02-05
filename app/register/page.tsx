import RegisterForm from "../ui/register-form";

function Page() {
  return (
    <div className="w-full h-screen bg-[url(/OIP.jpg)] bg-cover bg-[center_right]">
      <div className="container w-full h-full mx-auto flex items-center justify-center p-4 space-y-8">
        <RegisterForm />
      </div>
    </div>
  );
}

export default Page;
