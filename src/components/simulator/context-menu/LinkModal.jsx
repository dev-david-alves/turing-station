import React from "react";
import { cn } from "../../../utils/cn";
import { buttonVariants } from "../../Button";
import { Icon } from "@iconify/react/dist/iconify.js";

const options = [
  {
    id: "add-transition",
    label: "Adicionar transição",
  },
  {
    id: "flip-transition",
    label: "Inverter transição",
    className: "border-y-[1px] border-darkenBlue border-opacity-10",
  },
  {
    id: "delete-state",
    label: "Deletar estado",
    icon: "mdi:trash",
  },
];

function LinkModal({ id, className }) {
  return (
    <div className={cn("z-[200] w-full max-w-40 rounded-md bg-main py-2 shadow-lg", className)}>
      {options.map((option) => (
        <div className={cn("w-full", option.className || "")} key={option.id}>
          <button
            className={cn(
              buttonVariants({ variant: "popoverMenu" }),
              "group flex items-center justify-between gap-2 px-3 text-xs font-normal text-white",
            )}
          >
            <p>{option.label}</p>
            {option.icon && (
              <Icon
                icon={option.icon}
                className="icon h-4 w-4 max-w-full text-darkenBlue transition-colors duration-200 group-hover:text-danger"
              />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

export default LinkModal;
