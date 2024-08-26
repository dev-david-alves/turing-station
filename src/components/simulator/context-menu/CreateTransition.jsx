import React from "react";
import { Input } from "../../Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cn } from "../../../utils/cn";
import { buttonVariants } from "../../Button";

const CustomDirectionButton = ({ direction, ...props }) => {
  return (
    <button
      {...props}
      className="bg-gray-800 flex h-9 w-9 items-center justify-center rounded-md border-2 border-primary font-semibold text-white"
    >
      {direction}
    </button>
  );
};

function CreateTransition({ id, className }) {
  return (
    <div
      className={cn(
        "absolute z-[200] flex translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <div className="flex max-w-[220px] flex-col gap-2 rounded-md bg-main p-3 shadow-lg">
        <div className="flex w-full items-center gap-2">
          <Input type="text" id="read" placeholder="Lê" className="text-md py-1" />
          <Input type="text" id="write" placeholder="Escreve" className="text-md py-1" />
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-1">
            <CustomDirectionButton direction="E" />
            <CustomDirectionButton direction="D" />
            <CustomDirectionButton direction="P" />
          </div>

          <button
            className={cn(
              buttonVariants({ variant: "popoverMenu" }),
              "flex max-w-9 items-center justify-center rounded-md border-none bg-none p-0 text-white",
            )}
          >
            <Icon icon="uil:check" className="icon h-5 w-5 max-w-full" />
          </button>
        </div>
      </div>

      <div className="flex w-fit items-center gap-2 rounded-md bg-main px-3 py-1 italic text-white shadow-lg">
        A <Icon icon="solar:arrow-right-outline" className="icon h-5 w-5 max-w-full" /> B, E
      </div>
    </div>
  );
}

export default CreateTransition;
