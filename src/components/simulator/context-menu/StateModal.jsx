import React from "react";
import { cn } from "../../../utils/cn";
import { buttonVariants } from "../../Button";
import { Icon } from "@iconify/react/dist/iconify.js";

const options = [
  {
    id: "toggle-initial-state",
    label: "Definir como inicial",
  },
  {
    id: "toggle-final-state",
    label: "Definir como final",
  },
  {
    id: "rename-state",
    label: "Renomear",
    className: "border-y-[1px] border-darkenBlue border-opacity-10",
  },
  {
    id: "delete-state",
    label: "Deletar",
    icon: "mdi:trash",
  },
];

function StateModal({ id, className }) {
  return (
    <div
      id={`state-contextMenu-${id}`}
      className={cn("z-[200] w-full max-w-40 rounded-md bg-main py-2 shadow-lg", className)}
    >
      {options.map((option) => (
        <button
          key={option.id}
          id={`${option.id}-${id}`}
          className={cn(
            buttonVariants({ variant: "popoverMenu" }),
            "group flex items-center justify-between gap-2 px-3 text-xs font-normal text-white",
            option.className || "",
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
      ))}
    </div>
  );
}

export default StateModal;
