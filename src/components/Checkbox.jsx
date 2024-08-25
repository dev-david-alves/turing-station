import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "../utils/cn";
import { Icon } from "@iconify/react/dist/iconify.js";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "focus-visible:ring-ring data-[state=checked]:text-primary-foreground peer h-5 w-5 shrink-0 rounded-sm border-2 border-primary shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("text-current flex items-center justify-center")}>
      <Icon icon="fa:check" className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
