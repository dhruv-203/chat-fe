"use client";
interface FormLayoutProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className: string;
  children: React.ReactNode;
}
function FormLayout({ handleSubmit, className, children }: FormLayoutProps) {
  return (
    <form
      method="POST"
      onSubmit={handleSubmit}
      className={`flex flex-col p-6 gap-5  mx-auto justify-center items-center min-w-[300px] bg-slate-400 backdrop-blur-lg bg-opacity-20 shadow-xl rounded-xl  ${className}`}
    >
      {children}
    </form>
  );
}

export default FormLayout;
