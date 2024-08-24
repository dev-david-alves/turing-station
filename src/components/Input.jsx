import { cn } from "../utils/cn";

function Input({ type, placeholder, value, setValue, onChange, className, ...props }) {
  return (
    <input
      type={type || "text"}
      placeholder={placeholder || ""}
      value={value}
      onChange={onChange || (() => {})}
      {...props}
      className={cn(
        "bg-transparent w-full rounded-sm border-none px-3 py-[2px] text-white outline-none ring-2 ring-primary placeholder:text-infoDark",
        className,
      )}
    />
  );
}

export default Input;
