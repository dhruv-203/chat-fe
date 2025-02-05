interface InputProps {
  label: string;
  name: string;
  placeholder: string;
  type: string;
  labelClass: string;
  inputClass: string;
}
function Input({
  label,
  name,
  placeholder,
  type,
  inputClass,
  labelClass,
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row justify-center items-center">
      <label
        htmlFor={name}
        className={`text-start  w-full max-w-[400px]  px-4 py-2 text-base font-semibold ${labelClass}`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        required
        placeholder={placeholder}
        className={`px-4 py-2  text-black w-full max-w-[400px] text-center text-base rounded-md ${inputClass}`}
      />
    </div>
  );
}

export default Input;
