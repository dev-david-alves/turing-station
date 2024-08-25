import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../utils/cn";

const inputVariants = cva(
  "border-input placeholder:text-muted-foreground text-white focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-[2px] border-primary ring-primary/50 focus-visible:ring-primary/50 ouline-none",
      },
      size: {
        default: "px-4 py-2",
        sm: "p-2 text-sm",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Input = React.forwardRef(({ className, variant, size, type, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ variant, size, className }))} ref={ref} {...props} />;
});

Input.displayName = "Input";

const FloatingLabelInput = React.forwardRef(
  ({ inputClassName, variant, size, type, labelText, labelClassName, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          variant={variant}
          size={size}
          type={type}
          {...props}
          ref={ref}
          className={`peer placeholder-transparent ${inputClassName}`}
          placeholder="Renomear simulador"
        />
        <label
          htmlFor="rename"
          className={cn(
            "peer-placeholder-shown:text-gray-400 icon absolute -top-[1.3rem] left-0 px-0 text-sm text-white transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:px-4 peer-placeholder-shown:text-infoDark peer-focus:-top-[1.3rem] peer-focus:px-0 peer-focus:text-sm peer-focus:text-white",
            labelClassName,
          )}
        >
          {labelText}
        </label>
      </div>
    );
  },
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export { Input, FloatingLabelInput, inputVariants };
